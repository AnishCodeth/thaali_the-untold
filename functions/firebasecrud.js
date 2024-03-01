const { initializeApp}=require("firebase/app");
const { getStorage, uploadBytesResumable,ref,getDownloadURL} =require("firebase/storage");


const metadata = {
  contentType: 'image/jpeg'
};

const photo_firebase_url=async(url,filepath,i)=>{
const storage=getStorage()
const storageref=ref(storage,url)
const uploadTask=uploadBytesResumable(storageref,filepath,metadata)



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
      resolve(downloadurl)
    });
  }
);
}
)}


module.exports={photo_firebase_url}


