import React from "react";
import { useEffect } from "react";
import abi from "../../contracts/BuyMeACoffee.json"; // we need this to communicate with the smart contract
import { useState } from "react";
import { ethers } from "ethers";
import "./Hero.css";
const Hero = () => {
  const [formData, setFormData] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [data, setData] = useState({
    name: "",
    message: "",
  });

  const [followers,setFollowers] = useState([])

  useEffect(() => {
    const connectWallet = async () => {
      const contactAddress = "0xa3F06a52FdFfA21BcB281c878a5d727228362366";
      const contractAbi = abi.abi;
      // console.log(contractAbi)
      try {
        const { ethereum } = window;
        // console.log(ethereum);
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
          // console.log(account)
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contactAddress,
          contractAbi,
          signer
        );
        setFormData({ provider, signer, contract });
      } catch (e) {
        console.log(e);
      }
    };
    connectWallet();
  }, []);
  // console.log(formData)

  const handleChange = (e) => {
    e.preventDefault();
    setData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(data);
    setData({
      name: "",
      message: "",
    });
    const {contract} = formData;
    const amount = {value:ethers.utils.parseEther(".001")};
  const transaction = await contract.buyCoffee(data.name,data.message,amount);
  await transaction.wait()
  console.log("Transaction done")
  const memos = await formData.contract.getMemos();
  setFollowers(memos)
  console.log(memos)
  };

//   useEffect(()=>{
//     const getMemos = async() =>{

//         const memos = await formData.contract.getMemos();
//         setFollowers(memos)
//         console.log(memos)
//     }
//     formData.contract && getMemos()
//   },[formData.contract])


  

  return (
    <div className="h-screen w-full hero p-6">
      <p className="text-white text-4xl">
        Owner : <span className="text-3xl ">{formData.contract?.address}</span>
      </p>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-full flex flex-col mt-16 p-12 bg-gray-800 rounded-lg"
      >
        <input
          className="m-3 p-4"
          id="name"
          onChange={(e) => handleChange(e)}
          value={data.name}
          name="name"
          type="text"
          placeholder="Enter Your Name"
        />
        <input
          className="m-3 p-4"
          id="message"
          onChange={(e) => handleChange(e)}
          value={data.message}
          name="message"
          type="text"
          placeholder="Enter Your Message"
        />
        <button
          type="submit"
          className="p-3 bg-sky-900 m-3 rounded-md text-white"
        >
          Send
        </button>
      </form>
      {
        <div className="mt-16 text-center">

           <div className=" text-white w-full ">
            <div className=" flex justify-between items-center border border-blue-300  p-2 bg-slate-500">
                <p>Address</p>
                <p>Name</p>
                <p>Message</p>
            </div>
            {
                followers.map((follower)=>(
                    <div className="flex justify-between items-start text-left p-2 border border-blue-300 bg-slate-900 gap-4" key={follower[2]}>
                        <p>{follower[0]}</p>
                        <p>{follower.name}</p>
                        <p>{follower.message}</p>
                    </div>
                ))
            }
           </div>
        </div>
      }
    </div>
  );
};

export default Hero;
