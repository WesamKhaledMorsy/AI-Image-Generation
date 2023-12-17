const generateForm = document.querySelector(".generate-form");
const ImgGallery = document.querySelector(".image-gallery");
const OPENAI_API_KEY ="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";
let IsImgGenerated = false;
const updateImageCard =(imgDataArray) =>{
    imgDataArray.forEach((imgObject,index) => {
        const imgCard = ImgGallery.querySelectorAll(".img-card")[index];
        const imgElemnt = imgCard.querySelector('img');
        const downloadBtn = imgCard.querySelector('.download-btn');
        //Set the image source to th AI-generated image data
        const aiGenerated = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElemnt.src=aiGenerated;

        //When the image is  loaded remove the loading class and set download attribute
        imgElemnt.onload=()=>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href",aiGenerated);
            downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`)
        }
    });
}
generateAIimage= async(userPrompt,userImageQuantity)=>{
    try{
        //Send a request to the openAI API to generate images based on user inpute
        const respone = await fetch("https://api.openai.com/v1/images/generations",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body:JSON.stringify({
                prompt:userPrompt,
                n:parseInt(userImageQuantity),
                size:"512x512",
                response_format:"b64_json"
            })
        });
        if(!respone.ok) throw new Error("Failed to generate images! Please try again.");
        const {data}=await respone.json(); //Get data from response
        updateImageCard([...data]);
    }catch(error){
        alert(error.message)
    }finally{
        IsImgGenerated =false;
    }
}
const handelFormSubmission =(e)=>{
    e.preventDefault();
    if(IsImgGenerated) return;
    IsImgGenerated = true;
    // Get User input and image quantity from the form
    const userPrompt = e.srcElement[0].value;
    const userImageQuantity = e.srcElement[1].value;
    
    // Creating HTML markup for image cards with loading state
    const imgCardMarkUp= Array.from({length : userImageQuantity},()=>
        `<div class="img-card loading">
        <img src="images/loading.gif" alt="hot-air-balloon">
        <a href="#" class="download-btn">
            <img src="images/download-solid.svg" alt="download icon">
        </a>
    </div>`
    ).join("");

    ImgGallery.innerHTML=imgCardMarkUp;
    generateAIimage(userPrompt,userImageQuantity);
}
generateForm.addEventListener("submit",handelFormSubmission) ;