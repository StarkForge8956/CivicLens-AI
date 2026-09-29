from pathlib import Path
import shutil
import yaml


# ============================================================
# CONFIGURATION
# ============================================================

AI_DIR = Path(__file__).resolve().parent.parent

DATASETS_DIR = AI_DIR / "datasets"

SOURCE_DIR = DATASETS_DIR / "Combined 8000 images.v1-with-aug.yolov8"

OUTPUT_DIR = DATASETS_DIR / "civiclens_dataset"


# Original class name -> new CivicLens class name
CLASS_MAPPING = {
    "pothole": "pothole",
    "manhole": "manhole",
    "garbage bins": "garbage_bin",
    "garbage-overflow": "garbage_overflow",
}


TARGET_CLASSES = [
    "pothole",
    "manhole",
    "garbage_bin",
    "garbage_overflow",
]


# ============================================================
# FIND ORIGINAL CLASS NAMES
# ============================================================

def load_source_yaml():
    yaml_path = SOURCE_DIR / "data.yaml"

    if not yaml_path.exists():
        raise FileNotFoundError(
            f"Could not find data.yaml at:\n{yaml_path}"
        )

    with open(yaml_path, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


# ============================================================
# PREPARE ONE DATASET SPLIT
# ============================================================

def prepare_split(split_name, source_data, source_classes):
    source_images_dir = SOURCE_DIR / source_data / "images"
    source_labels_dir = SOURCE_DIR / source_data / "labels"

    output_images_dir = OUTPUT_DIR / split_name / "images"
    output_labels_dir = OUTPUT_DIR / split_name / "labels"

    output_images_dir.mkdir(parents=True, exist_ok=True)
    output_labels_dir.mkdir(parents=True, exist_ok=True)

    if not source_images_dir.exists():
        print(f"WARNING: Missing images directory: {source_images_dir}")
        return 0

    if not source_labels_dir.exists():
        print(f"WARNING: Missing labels directory: {source_labels_dir}")
        return 0

    copied_images = 0

    image_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".bmp",
        ".webp",
    }

    for image_path in source_images_dir.iterdir():

        if image_path.suffix.lower() not in image_extensions:
            continue

        label_path = source_labels_dir / f"{image_path.stem}.txt"

        if not label_path.exists():
            continue

        new_annotations = []

        with open(label_path, "r", encoding="utf-8") as file:

            for line in file:
                line = line.strip()

                if not line:
                    continue

                parts = line.split()

                if len(parts) != 5:
                    continue

                original_class_id = int(parts[0])

                if original_class_id >= len(source_classes):
                    continue

                original_class_name = source_classes[original_class_id]

                if original_class_name not in CLASS_MAPPING:
                    continue

                new_class_name = CLASS_MAPPING[original_class_name]
                new_class_id = TARGET_CLASSES.index(new_class_name)

                new_annotations.append(
                    f"{new_class_id} "
                    f"{parts[1]} "
                    f"{parts[2]} "
                    f"{parts[3]} "
                    f"{parts[4]}"
                )

        # Only keep images containing at least one target object.
        if not new_annotations:
            continue

        shutil.copy2(
            image_path,
            output_images_dir / image_path.name
        )

        with open(
            output_labels_dir / label_path.name,
            "w",
            encoding="utf-8"
        ) as file:

            file.write("\n".join(new_annotations))

        copied_images += 1

    print(
        f"{split_name}: copied {copied_images} images"
    )

    return copied_images


# ============================================================
# CREATE DATA.YAML
# ============================================================

def create_data_yaml():
    data = {
        "path": str(OUTPUT_DIR.resolve()),
        "train": "train/images",
        "val": "valid/images",
        "test": "test/images",
        "nc": len(TARGET_CLASSES),
        "names": TARGET_CLASSES,
    }

    yaml_path = OUTPUT_DIR / "data.yaml"

    with open(
        yaml_path,
        "w",
        encoding="utf-8"
    ) as file:

        yaml.safe_dump(
            data,
            file,
            sort_keys=False
        )

    print(f"\nCreated: {yaml_path}")


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print("CivicLens Dataset Preparation")
    print("=" * 60)

    if not SOURCE_DIR.exists():
        raise FileNotFoundError(
            f"\nSource dataset not found:\n{SOURCE_DIR}\n"
        )

    source_config = load_source_yaml()

    source_classes = source_config["names"]

    print("\nOriginal classes:")
    for index, name in enumerate(source_classes):
        print(f"  {index}: {name}")

    print("\nKeeping only:")
    for name in CLASS_MAPPING:
        print(f"  {name} -> {CLASS_MAPPING[name]}")

    print("\nCreating CivicLens dataset...\n")

    # Remove an old generated dataset if one exists.
    if OUTPUT_DIR.exists():
        print("Removing previous generated dataset...")
        shutil.rmtree(OUTPUT_DIR)

    OUTPUT_DIR.mkdir(parents=True)

    total_images = 0

    split_mapping = {
        "train": "train",
        "valid": "valid",
        "test": "test",
    }

    for output_split, source_split in split_mapping.items():

        total_images += prepare_split(
            output_split,
            source_split,
            source_classes
        )

    create_data_yaml()

    print("\n" + "=" * 60)
    print("DATASET PREPARATION COMPLETE")
    print("=" * 60)

    print(f"\nTotal images copied: {total_images}")

    print("\nCivicLens classes:")

    for index, name in enumerate(TARGET_CLASSES):
        print(f"  {index}: {name}")

    print(
        f"\nDataset location:\n{OUTPUT_DIR.resolve()}"
    )


if __name__ == "__main__":
    main()