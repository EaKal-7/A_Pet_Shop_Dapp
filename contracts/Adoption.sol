// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Adoption {
    struct pet{
        string name;
        uint age;
        string breed;
        string location;
        string image;
        address owner;
        uint state; //0是为收养 1是已收养 2是在贩卖
    }
    address[16] public adopters;
    pet[] public pets;
    uint public petCount;
    mapping(uint256 => bool) public petsForSale;
    mapping(uint256 => uint256) public petPrices;
    mapping(address => uint256) public balances;
    address public administrator;

    event PetAdded(string name, uint age, string breed, string location, string image);
    event PetAdopted(address adopter, uint petId);
    event PetPutForSale(address owner, uint petId, uint price);
    event PetSold(address buyer, uint petId);

    constructor() public {
        administrator = msg.sender;
        addPetsFromJSON();
        // for(uint i = 0; i < 16; i++) {
        //     adopters.push(address(0));
        // }
    }


    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= petCount,"ERROR: petId must be in range");
        require(adopters[petId] == address(0), "Pet already adopted");
        adopters[petId] = msg.sender;
        return petId;
    }

    function adoptforpets(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= petCount,"ERROR: petId must be in range");
        require(pets[petId].owner == address(0), "Pet already adopted");
        pets[petId].owner = msg.sender;

        pets[petId].state = 1; //0是为收养 1是已收养 2是在贩卖
        emit PetAdopted(msg.sender, petId);

        return petId;
    }

    

    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

    function getAdopters_address() public view returns (address[] memory) {
        address[] memory adopters_address = new address[](petCount);
        for (uint i = 0; i < petCount; i++) {
            adopters_address[i] = pets[i].owner;
        }
        return adopters_address;
    }

    function adopt_free(uint petId) public returns(uint)  {
        require(petId >= 0 && petId <= 15,"ERROR: petId must be in range");
        require(adopters[petId] == msg.sender, "Pet already free");
        adopters[petId] = address(0);
        return petId;
    }

    //弃用
    function adopt_freeforpets(uint petId) public returns(uint)  {
        require(petId >= 0 && petId <= petCount,"ERROR: petId must be in range");
        require(pets[petId].owner == msg.sender, "Pet already free");
        pets[petId].owner = address(0);
        return petId;
    }

    function getptes_name(uint petId) public view returns (string memory) {
        require(petId >= 0 && petId < petCount,"ERROR: petId must be in range");
        return pets[petId].name;
    }

    function getptes_age(uint petId) public view returns (uint) {
        require(petId >= 0 && petId < petCount,"ERROR: petId must be in range");
        return pets[petId].age;
    }

    function getptes_breed(uint petId) public view returns (string memory) {
        require(petId >= 0 && petId <= petCount,"ERROR: petId must be in range");
        return pets[petId].breed;
    }

    function getptes_location(uint petId) public view returns (string memory) {
        require(petId >= 0 && petId <= petCount,"ERROR: petId must be in range");
        return pets[petId].location;
    }

    function getptes_image(uint petId) public view returns (string memory) {
        require(petId >= 0 && petId <= petCount,"ERROR: petId must be in range");
        return pets[petId].image;
    }

    function getptes_owner(uint petId) public view returns (address) {
        require(petId >= 0 && petId <= petCount,"ERROR: petId must be in range");
        return pets[petId].owner;
    }

    function getptes_state(uint petId) public view returns (uint) {
        require(petId >= 0 && petId <= petCount,"ERROR: petId must be in range");
        return pets[petId].state;
    }

    function getptes_count() public view returns (uint) {
        return petCount;
    }

    function isadmin() public view returns (bool) {
        if(msg.sender==administrator){
            return true;
        }else{
            return false;
        }
    //    return msg.sender==admin;
    }

    function getprice(uint256 petId) public view returns (uint256) {
        return petPrices[petId];
    }

    function addpet(
        string memory name, 
        uint age, 
        string memory breed, 
        string memory location, 
        string memory image
        ) public returns (uint) {
        require(msg.sender==administrator,"You are not the admin");
        pet memory newpet = pet(name, age, breed, location, image, address(0), 0);
        pets.push(newpet);
        petCount++;

        emit PetAdded(name, age, breed, location, image);

        return petCount;
    }

    function sellPet(uint256 petId, uint256 price) public {
        require(petId >= 0 && petId < pets.length, "Invalid petId");
        require(pets[petId].owner == msg.sender, "You are not the owner of the pet");
        petsForSale[petId] = true;
        petPrices[petId] = price;
        pets[petId].state = 2; //0是为收养 1是已收养 2是在贩卖

        emit PetPutForSale(msg.sender, petId, price);
    }

    function buyPet(uint256 petId) public payable {
        require(petId >= 0 && petId < pets.length, "Invalid petId");
        require(petsForSale[petId], "The pet is not for sale");
        require(msg.value >= petPrices[petId], "Insufficient funds");
        
        address previousOwner = pets[petId].owner;
        pets[petId].owner = msg.sender;
        petsForSale[petId] = false;
        petPrices[petId] = 0;
        
        // Transfer the payment to the previous owner
        address payable previousOwnerPayable = address(uint160(previousOwner));
        previousOwnerPayable.transfer(msg.value);

        pets[petId].state = 1; //0是为收养 1是已收养 2是在贩卖
        emit PetSold(msg.sender, petId);
    }

    function addPetsFromJSON() private {
        addpet("Frieda", 3, "Scottish Terrier", "Lisco, Alabama", "images/scottish-terrier.jpeg");
        addpet("Gina", 3, "Scottish Terrier", "Tooleville, West Virginia", "images/scottish-terrier.jpeg");
        addpet("Collins", 2, "French Bulldog", "Freeburn, Idaho", "images/french-bulldog.jpeg");
        addpet("Melissa", 2, "Boxer", "Camas, Pennsylvania", "images/boxer.jpeg");
        addpet("Jeanine", 2, "French Bulldog", "Gerber, South Dakota", "images/french-bulldog.jpeg");
        addpet("Elvia", 3, "French Bulldog", "Innsbrook, Illinois", "images/french-bulldog.jpeg");
        addpet("Latisha", 3, "Golden Retriever", "Soudan, Louisiana", "images/golden-retriever.jpeg");
        addpet("Coleman", 3, "Golden Retriever", "Jacksonwald, Palau", "images/golden-retriever.jpeg");
    }

    // function getptes_count();

}