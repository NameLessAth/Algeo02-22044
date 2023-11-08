from PIL import Image
import numpy as np

def create_GLCM(image, distance_x, distance_y):
    num_rows, num_cols = image.size
    glcm = np.zeros((256, 256))

    for i in range(num_rows):
        for j in range(num_cols):
            if i + distance_y < num_rows and j + distance_x < num_cols:
                val1 = image.getpixel((j, i))
                val2 = image.getpixel((j + distance_x, i + distance_y))

                r1 = (val1[0] // 65536) % 256
                g1 = (val1[0] // 256) % 256
                b1 = val1[0] % 256

                r2 = (val2[1] // 65536) % 256
                g2 = (val2[1] // 256) % 256
                b2 = val2[1] % 256

                gray1 = round(0.299 * r1 + 0.587 * g1 + 0.114 * b1)
                gray2 = round(0.299 * r2 + 0.587 * g2 + 0.114 * b2)

                glcm[gray1][gray2] += 1

    return glcm

def extract_contrast(image_path):
    image = Image.open(image_path)
    texture_contrast = []

    glcm = create_GLCM(image, 1, 1)
    contrast = 0
    for i in range(len(glcm)):
        for j in range(len(glcm[i])):
            curr_contrast = (i - j) ** 2 * glcm[i][j]
            contrast += curr_contrast

    texture_contrast.append(contrast)

    return texture_contrast

def debug_GLCM(image_path, distance_x, distance_y):
    image = Image.open(image_path)
    glcm = extract_contrast(image)
    for i in range(len(glcm)):
        for j in range(len(glcm[i])):
            print(f"GLCM[{i}][{j}]: {glcm[i][j]}")

def extract_homogeneity(image_path):
    image = Image.open(image_path)
    texture_homogeneity = []

    glcm = create_GLCM(image, 1, 1)
    homogen = 0
    for i in range(len(glcm)):
        for j in range(len(glcm[i])):
            curr_homogen = glcm[i][j] / (1 + (i - j) ** 2)
            homogen += curr_homogen

    texture_homogeneity.append(homogen)

    return texture_homogeneity

def extract_entropy(image_path):
    image = Image.open(image_path)
    texture_entropy = []
    glcm = create_GLCM(image, 1, 1)
    entropy = 0
    for i in range(len(glcm)):
        for j in range(len(glcm[i])):
            if glcm[i][j] != 0:
                curr_entropy = glcm[i][j] * np.log(glcm[i][j])
                entropy += curr_entropy
    texture_entropy.append(entropy)
    return texture_entropy

def CBIR(image_path, database):
    image_contrast = extract_contrast(image_path)
    image_homogeneity = extract_homogeneity(image_path)
    image_entropy = extract_entropy(image_path)

debug_GLCM('./dataset/0.jpg', 1, 1)