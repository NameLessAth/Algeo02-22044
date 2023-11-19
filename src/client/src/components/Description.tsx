import WhiteBar from "./WhiteBar";

function Description() {
  return (
    <div className="w-full h-full text-nlightgray px-5 flex flex-col justify-center items-center">
      <WhiteBar />
      <div className="m-4 w-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center">Konsep Singkat</h2>
        <br />
        <p className="m-2 text-justify w-3/5">
        CBIR (Content-Based Information Retrieval) adalah sebuah proses yang digunakan untuk
        menacari dan mengambil gambar berdasarkan kontennya. Proses CBIR pada umumnya bermula
        dari ekstrasi fitur-fitur penting di sebuah gambar seperti warna, tekstur, dan bentuk.
        Setelah diekstrak, konten-konten tersebut dimasukkan ke sebuah wadah yang biasanya
        merupakan vektor, atau vektor dari vektor (matriks), atau seterusnya. Lalu setelah
        diekstrak, konten tersebut akan diolah sesuai dengan cara tertentu.
        </p>
        <p className="m-2 text-justify w-3/5">
        Di sini, kita memakai dua cara, yaitu CBIR dengan parameter warna dan CBIR dengan parameter
        tekstur. CBIR dengan parameter warna, nantinya matriks RGB akan diubah menjadi matriks HSV,
        dan akan dibandingkan dengan menggunakan fungsi Cosine Similiarity.
        </p>
        <p className="m-2 text-justify w-3/5">
        CBIR dengan texture mengambil gambar dan mengubahnya kedalam matriks rgb lalu diproses
        kedalam matriks grayscale dan dicari matriks ketetanggaannya dari matriks grayscale yang
        nantinya ini menjadi matriks GLCM, lalu matriks GLCM ditranspose dan dijumlahkan dengan matriks
        GLCM itu sendiri. lalu diekstrak 3 fitur dari matriks tersebut yaitu, contrast, homogeneity,
        dan entropy yang ketiganya dijadikan satu vektor dan dibandingkan menggunakan cosine similarity.
        </p>
      </div>
      <WhiteBar />
      <div className="m-4">
        <h2 className="text-2xl font-bold text-center">How To Use</h2>
        <br />
        <ol className="list-disc list-inside mt-2">
          <li>Upload a dataset folder containing images (preferably jpg) via the "Upload Datasets" button</li>
          <li>Upload the image whose similarity you want to look for (preferably jpg) via the "Upload Image" button</li>
          <li>Choose whether you want to look for similar colors or textures via the available toggle button.</li>
          <li>Press the search button</li>
          <li>Let the website cook</li>
        </ol>
      </div>
      <WhiteBar />
      <div className="m-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold">About Us</h2>
        <br />
        <p className="m-2 text-center">
            Kami adalah sekelompok makhluk Jawa yang cinta Aksara Jawa aka JavaScript 
            <br />
            tapi karena TypeScript superior, jadi kami pakai TypeScript.
        </p>
        <br />
        <img src="./images/thumbnail.png" alt="origin of jawa" className="mt-4 md:w-3/5" />
      </div>
    </div>
  );
}

export default Description;
