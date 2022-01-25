import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import {
  nftaddress, 
  nftmarketaddress
} from '../config'
import styles from '../styles/Home.module.css'
import { SiEthereum } from "react-icons/si";
import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";



const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
);



export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems(); //get data

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri) //https://ipfs....
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl" style={{color: "white"}}>No items in marketplace</h1>)
  
  
  return (
    <div>
      <br/>
      <h1 style={{color: "white", fontSize: "60px", fontWeight: 700, marginLeft:"20px"}}>
          NFT Marketplace
          </h1>
          <hr style={{ width:"90%", marginLeft:"20px"}}/>
          <br/>
          <p style={{color: "white", fontWeight: 300, marginLeft:"20px", width:"90%"}} >
          Crypto Web3.0 is the world’s first and largest marketplace where you can buy and sell NFTs. It’s compatible with the Ethereum, Polygon, and Klaytn blockchains. You can browse through more than 34 million NFTs on this platform sorted into dozens of categories, ranging from digital art to collectibles, game items, virtual worlds, and domain names.

        To sign up on Crypto Web3.0, you need an Ethereum wallet like MetaMask and pay a signup fee to initialize your account. Many NFT platforms take gas fees upfront. A gas fee is the cost of validating transactions on a blockchain network.
          </p><br/>
          {/* <div>
            <MetaMaskLoginButton />
          </div> */}
          <div className="flex-1 flex flex-row justify-start items-center">
            <ServiceCard
              color="bg-[#F84550]"
              title="Fast Transactions"
              icon={<RiHeart2Fill fontSize={21} className="text-white" />}
              subtitle="Your personal data is encrypted and all transactions are 100% secured"
            />
            <ServiceCard
              color="bg-[#2952E3]"
              title="Safe & secure"
              icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
              subtitle="Your personal data is encrypted and all transactions are 100% secured"
            />
            <ServiceCard
              color="bg-[#8945F8]"
              title="24/7 support"
              icon={<BiSearchAlt fontSize={21} className="text-white" />}
              subtitle="Your personal data is encrypted and all transactions are 100% secured"
            />
          </div>
          <br/><br/>
          <h1 style={{color: "white", fontSize: "30px", fontWeight: 100, marginLeft:"20px"}}>
            <u>Available Assets</u>
          </h1>
          <br/>
    <div className="flex justify-center">
       <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden bg-[#3A3B3C]
              // white-glassmorphism1
              ">
                <div style={{height:"200px",background: `linear-gradient( rgba(0, 0, 0,1), rgba(0, 0, 0, 0.2))`}}><img src={nft.image} /></div>
                <div className="p-4">
                  <p style={{ height: '64px', fontWeight:"900" }} className="text-white text-3xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-white " >{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-[#3A3B3C]">
                  <p className="text-2xl mb-4 font-bold text-white">ETH - {nft.price}</p><hr/><br/>
                  {/* <SiEthereum fontSize={21} color="#fff" style={{marginTop:"-27px", marginLeft:"130px"}}/> */}
                  <button className="w-full bg-[#fe8c00] text-white font-bold py-2 px-12 rounded-xl" onClick={() => buyNft(nft)}>Buy NFT</button>
                </div>
              </div>
            ))
          }<br/>
        </div>
      </div>
    </div><br/><br/>
    </div>
  )
}
// const intBg =
//   "https://res.cloudinary.com/fitness-glory/image/upload/v1633216239/young-woman-drinking-water-gym-exercise-concept_1_gtwi3b.jpg";
// const bgImgA = {
//   background: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)) ,url(${intBg})`,
//   backgroundSize: "cover",
//   position: "center",
//   marginTop: "-20px",
//   right: "0%",
//   left: "0%",
//   width: "100%",
//   height: "100%",
// };
