#!/usr/bin/env python3

"""
Usage:
    python3 image_convolution.py input_image.jpg
"""

import sys
from PIL import Image
import numpy as np
from numpy.lib.stride_tricks import sliding_window_view
import os

# -----------------------------
# KERNEL = np.array([
#     [-1, -1, -1],
#     [-1,  8, -1],
#     [-1, -1, -1],
# ], dtype=float)

# KERNEL = np.array([
#     [0, -1, 0],
#     [-1,  5, -1],
#     [0, -1, 0],
# ], dtype=float)

KERNEL = np.array([
    [1/16, 2/16, 1/16],
    [10/16,  1, 10/16],
    [1/16, 2/16, 1/16],
], dtype=float)
# -----------------------------


def apply_convolution(image: Image.Image, kernel: np.ndarray) -> Image.Image:
    """Apply a 2D convolution kernel to each RGB channel of a PIL image."""
    img = image.convert("RGB")
    img_array = np.array(img, dtype=float)  # shape: (h, w, 3)

    h, w, c = img_array.shape
    kh, kw = kernel.shape
    pad_h, pad_w = kh // 2, kw // 2

    # Output array
    output = np.zeros_like(img_array)

    # Process each channel independently
    for channel in range(3):
        channel_data = img_array[:, :, channel]

        # Pad each channel
        padded = np.pad(channel_data, ((pad_h, pad_h), (pad_w, pad_w)), mode="edge")

        # Convolution
        for i in range(h):
            for j in range(w):
                region = padded[i:i+kh, j:j+kw]
                output[i, j, channel] = np.sum(region * kernel)

    # Clip and convert back to uint8
    output = np.clip(output, 0, 255).astype(np.uint8)

    return Image.fromarray(output)


def main():
    if len(sys.argv) < 2:
        print("Usage: python image_convolution.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    try:
        img = Image.open(image_path)
    except Exception as e:
        print(f"Error opening image: {e}")
        sys.exit(1)

    result = apply_convolution(img, KERNEL)
    out_path = "convolved_gaussian_blur/" + image_path
    result.save(out_path)
    print(f"Saved convolved image to {out_path}")


if __name__ == "__main__":
    main()
