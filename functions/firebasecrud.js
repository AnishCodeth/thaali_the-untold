const { initializeApp}=require("firebase/app");
const { getStorage, uploadBytesResumable,ref,getDownloadURL} =require("firebase/storage");




const photo_firebase_url=async(url,filepath,i,file)=>{

  const metadata = {
    contentType: file.mimetype
  };
const storage=getStorage()
const storageref=ref(storage,url)
const uploadTask=uploadBytesResumable(storageref,file.buffer,metadata)
return  new Promise((resolve,reject)=>{
  uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject(error)
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadurl) => {
      url[i]=downloadurl
      console.log(i)
      resolve(downloadurl)
    });
  }
);
}
)}


module.exports={photo_firebase_url}


