async function init() {
    if (window.ethereum == null) {
        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed so are
        // only have read-only access
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider();
    } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum);
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        alert("O Metamask irá pedir aprovação para acessar essa página.\nPor favor, aceite.");
        signer = await provider.getSigner();
        network = await provider.getNetwork();
        contract = new ethers.Contract("0xBca236FD0aB582a5FF232c533D8ab04dD580511c", abi, signer);
        console.log("selected provider: ", provider);
        console.log("network:", network);
        console.log("signer: ", signer);
        console.log("contract: ", contract);

        const networkAccount = document.getElementById("networkAccount");
        networkAccount.innerHTML = signer.address;
        const networkNetworkID = document.getElementById("networkNetworkID");
        networkNetworkID.innerHTML = network.chainId;
        // Create a contract
        const nftNomeObj = await contract.name();
        const nftNome = document.getElementById("nftNome");
        nftNome.innerHTML = nftNomeObj;
        const metadadosURL = await contract.tokenURI(0);
        console.log("metadadosURL: ", metadadosURL);
        const metadadadosResp = await fetch(metadadosURL);
        console.log("metadadadosResp: ", metadadadosResp);
        const metadados = await metadadadosResp.json();
        console.log("metadadadosResp Body: ", metadados);
        const nftDesc = document.getElementById("nftDesc");
        nftDesc.innerHTML = metadados.description;
        const imgNFT = document.getElementById("imgNFT");
        imgNFT.src = metadados.image;
        const divImg = document.getElementById("divImg");
        divImg.style.display = "block";
    }
}
document.getElementById('btnSubmit').addEventListener('click', async () => {
    event.preventDefault();
    const form = document.getElementById("formMint");
    alert("Aguarde e confirme a transação no Metamask");
    const tx = await contract.safeMint(form.formTo.value, form.formMetadados.value);
    console.log("tx enviada: ", tx);
    alert("Transação enviada a Blockchain. Aguarde.\nTx ID:" + tx.hash);
    const txReceipt = await tx.wait();
    console.log("txReceipt: ", txReceipt);
    if (txReceipt.status === 1) {
        alert("Parabéns! Novo NFT gerado");
        form.reset();
    }
})
let signer = null;
let provider;
let network;
let contract;
init();