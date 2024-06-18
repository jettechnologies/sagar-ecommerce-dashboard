export const imageValidate = (imageArr: File[]) =>{
    // always pass the imageArr asan array;

    const allowedExtensions = /\.(jpg|jpeg|png|svg)$/i;
    let isValid = true;

    imageArr.forEach(file => {
        const fileSize = parseInt((file.size / 1048576).toFixed(2))

        if (!allowedExtensions.test(file.name)) {
            alert("Invalid file type. Only jpg, jpeg, png, and svg files are allowed.");
            isValid = false;
            return;
        }
        else if(fileSize > 6){
            alert("File to bigger than 6mb");
            console.log("file to big");
            isValid = false;
            return;
        }   
    })  
    return isValid;
}

 // const allowedExtensions = /\.(jpg|jpeg|png|svg)$/i;
        // const sizeInMb = 2;

        // Array.from(files).forEach(file => {
        //     const fileSize = parseInt((file.size / 1048576).toFixed(2))
        //     console.log(fileSize, typeof fileSize);

        //     if (!allowedExtensions.test(file.name)) {
        //         alert("Invalid file type. Only jpg, jpeg, png, and svg files are allowed.");
        //         return;
        //     }
        //     else if(fileSize > 2){
        //         alert("File to big");
        //         console.log("file to big")
        //         return;
        //     }
    // })  