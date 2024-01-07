const { initializeApp}=require("firebase/app");
const { getStorage, uploadBytesResumable,ref,getDownloadURL} =require("firebase/storage");




const photo_firebase_url=async(category,food_name,file_name,url,i)=>{
const storage=getStorage()
const storageref=ref(storage,`photos/${category}/${food_name}`)
const uploadTask=uploadBytesResumable(storageref,`../uploads/${file_name}`)

return  new Promise((resolve,reject)=>{
  uploadTask.on('state_changed',
  (snapshot) => {
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
      resolve(url[i])
    });
  }
);
}
)}


module.exports={photo_firebase_url}


