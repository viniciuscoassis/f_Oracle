import { useState } from "react";
import Navigation from "./components/Navigation";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import { HfInference } from '@huggingface/inference'
import { Buffer } from 'buffer';

function App() {
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [url, setURL] = useState(null)
  const [isWaiting, setIsWaiting] = useState(false)
  const [message, setMessage] = useState("")

  const submitHandler = async (e) => {
    e.preventDefault()

    if (name === "" || description === "") {
      window.alert("Please provide a name and description")
      return
    }

    setIsWaiting(true)

    // // Call AI API to generate a image based on description
    const imageData = await createImage()

    // // Upload image to IPFS (NFT.Storage)
    // const url = await uploadImage(imageData)

    // // Mint NFT
    // await mintImage(url)

    setIsWaiting(false)
    // setMessage("")
  }

  const createImage = async () => {
    setMessage("Generating Image...")

    const hf = new HfInference(process.env.REACT_APP_HUGGING_FACE_API_KEY);
    const blob = await hf.textToImage({
        model: "stabilityai/stable-diffusion-2",
        inputs: description + 'for profile picture',
        parameters: {
            negative_prompt: "blurry, realistic, low quality",
        },
    });
    const windowURL = window.URL || window.webkitURL;
    const imageUrl = windowURL.createObjectURL(blob);
    console.log(imageUrl)
    setImage(imageUrl)
  }

  return (
  <>
  <div>
      <Navigation account={account} setAccount={setAccount} />

      <div className='form'>
        <form onSubmit={submitHandler}>
          <input type="text" placeholder="Create a name..." onChange={(e) => { setName(e.target.value) }} />
          <input type="text" placeholder="Create a description..." onChange={(e) => setDescription(e.target.value)} />
          <input type="submit" value="Create & Mint" />
        </form>

        <div className="image">
          {!isWaiting && image ? (
            <img src={image} alt="AI generated PFP" />
          ) : isWaiting ? (
            <div className="image__placeholder">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
            />
              <p>{message}</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {!isWaiting && url && (
        <p>
          View&nbsp;<a href={url} target="_blank" rel="noreferrer">Metadata</a>
        </p>
      )}
    </div></>)
}

export default App;
