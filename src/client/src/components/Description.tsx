import WhiteBar from "./WhiteBar"

function Description() {
    return (
        <>
            <WhiteBar />
            <div>
                <h2>Konsep Singkat</h2>
                <p>
                    CBIR (Content-Based Information Retrieval) adalah sebuah proses yang digunakan untuk 
                    menacari dan mengambil gambar berdasarkan kontennya. Proses CBIR pada umumnya bermula 
                    dari ekstrasi fitur-fitur penting di sebuah gambar seperti warna, tekstur, dan bentuk. 
                    Setelah diekstrak, konten-konten tersebut dimasukkan ke sebuah wadah yang biasanya 
                    merupakan vektor, atau vektor dari vektor (matriks), atau seterusnya. Lalu setelah 
                    diekstrak, konten tersebut akan diolah sesuai dengan cara tertentu.
                </p>
                <p>
                    Di sini, kita memakai dua cara, yaitu CBIR dengan parameter warna dan CBIR dengan parameter 
                    tekstur. CBIR dengan parameter warna, nantinya matriks RGB akan diubah menjadi matriks HSV, 
                    dan akan dibandingkan dengan menggunakan fungsi Cosine Similiarity.
                </p>
                <p>
                    CBIR dengan texture mengambil gambar dan mengubahnya kedalam matriks rgb lalu diproses 
                    kedalam matriks grayscale dan dicari matriks ketetanggaannya dari matriks grayscale yang 
                    nantinya ini menjadi matriks GLCM, lalu matriks GLCM ditranspose dan dijumlahkan dengan matriks 
                    GLCM itu sendiri. lalu diekstrak 3 fitur dari matriks tersebut yaitu, contrast, homogeneity, 
                    dan entropy yang ketiganya dijadikan satu vektor dan dibandingkan menggunakan cosine similarity.
                </p>
            </div>
            <WhiteBar />
            <div>
                <h2>How To Use</h2>
                <li>
                    <ol>Upload a dataset folder containing images (preferably jpg) via the "Upload Datasets" button</ol>
                    <ol>Upload the image whose similarity you want to look for (preferably jpg) via the "Upload Image" button</ol>
                    <ol>Choose whether you want to look for similar colors or textures via the available toggle button.</ol>
                    <ol>Press the search button</ol>
                    <ol>Let the website cook</ol>
                </li>
            </div>
            <WhiteBar />
            <div>
                <h2>About Us</h2>
                <p>Kami adalah sekelompok makhluk Jawa yang cinta Aksara Jawa aka JavaScript tapi</p>
                <p>karena TypeScript superior, jadi kami pakai TypeScript.</p>
                <img src="./images/thumbnail.png" alt="origin of jawa"/>
            </div>
        </>
    )
}

export default Description