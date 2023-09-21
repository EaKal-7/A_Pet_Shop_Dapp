App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON('../pets.json', function (data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      // for (i = 0; i < data.length; i++) {
      //   petTemplate.find('.panel-title').text(data[i].name);
      //   petTemplate.find('img').attr('src', data[i].picture);
      //   petTemplate.find('.pet-breed').text(data[i].breed);
      //   petTemplate.find('.pet-age').text(data[i].age);
      //   petTemplate.find('.pet-location').text(data[i].location);
      //   petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

      //   petsRow.append(petTemplate.html());
      // }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  hideTransparentModal:function () {
    $('#transparentModal').modal('hide');
  },

  initContract: function () {
    $.getJSON('Adoption.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var AdoptionArtifact = data;
      var adoptionInstance;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      // 
      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        adoptionInstance.PetAdded({}, { fromBlock: 'latest' }).watch(function (error, event) {
          if (!error) {
            // 显示透明弹窗提醒
            showTransparentModal("Admin Added: " + event.args.name);
          } else {
            console.error(error);
          }
        });
      
      
      adoptionInstance.PetAdopted({}, { fromBlock: 'latest' }).watch(function (error, event) {
        if (!error) {
          // 显示透明弹窗提醒
          showTransparentModal(event.args.adopter+" Adopted: Pet ID " + event.args.petId);
        } else {
          console.error(error);
        }
      });
      
      adoptionInstance.PetSold({}, { fromBlock: 'latest' }).watch(function (error, event) {
        if (!error) {
          // 显示透明弹窗提醒
          showTransparentModal(event.args.buyer+" Buy : Pet ID " + event.args.petId);
        } else {
          console.error(error);
        }
      });
      adoptionInstance.PetPutForSale({}, { fromBlock: 'latest' }).watch(function (error, event) {
        if (!error) {
          // 显示透明弹窗提醒
          showTransparentModal(event.args.owner+"  Sold: Pet ID " + event.args.petId+" with "+ event.args.price+" Gwei");
        } else {
          console.error(error);
        }
      });
    });
      App.displayAccountBalance();
      App.Disablebutton();
      return App.markAdopted();

    });


    return 1;
  },



  Disablebutton: function () {
    var result;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      // console.log(account);
      console.log(account);
      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        
      return adoptionInstance.isadmin.call({from:account});
      }).then(function (adoptedPets) {
        console.log(adoptedPets);
        if(adoptedPets){
          $("#Addbutton").show();
        }else{
          $("#Addbutton").hide();
        }

      });});
  },


  markAdopted: function () {
    var temp={};
    var adoptionInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      // console.log(account);
      
      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        // console.log(adoptionInstance);
      //   // Call getAdoptedPets function from smart contract
      return adoptionInstance.getAdopters_address.call();
      }).then(async function (adoptedPets) {
        var petsRow = $('#petsRow');
        // var petTemplate = $('#petTemplate');
        petsRow.empty();
        // console.log(myPetsRow);
        for(var i = 0; i < adoptedPets.length; i++) {
          var petTemplate = $('#petTemplate');
          // console.log(adoptedPets[i]);
          // console.log('i='+i);
          // var tempp=i;
          temp['panel-title'] = await adoptionInstance.getptes_name.call(i);
          temp['img'] = await adoptionInstance.getptes_image.call(i);
          temp['pet-breed'] = await adoptionInstance.getptes_breed.call(i);
          temp['pet-age'] = await adoptionInstance.getptes_age.call(i);
          temp['pet-location'] = await adoptionInstance.getptes_location.call(i);
          temp['btn-adopt'] = await adoptionInstance.getptes_state.call(i);
          // console.log(temp);
          petTemplate.find('.panel-title').text(temp['panel-title']);
          petTemplate.find('img').attr('src', temp['img']);
          petTemplate.find('.pet-breed').text(temp['pet-breed']);
          petTemplate.find('.pet-age').text(temp['pet-age']);
          petTemplate.find('.pet-location').text(temp['pet-location']);
          // console.log(temp['btn-adopt']);
          
          // console.log(adoptedPets[i]);
          if (await adoptedPets[i]==account){
            if (temp['btn-adopt'] == 2) {
            petTemplate.find('.btn-default').text('Selling')
            .removeClass('btn-adopt')
            .removeClass('btn-sell')
            .removeClass('btn-adopt-free')
            .removeClass('btn-buy')
            .attr('data-id', i)
            .prop('disabled', true);
            // .addClass('btn-sell');
          }else if(temp['btn-adopt'] == 1){
            // console.log(i);
            petTemplate.find('.btn-default').text('Sell')
            .removeClass('btn-adopt')
              .removeClass('btn-sell')
              .removeClass('btn-adopt-free')
              .removeClass('btn-buy')
              .attr('data-id', i)
              .prop('disabled', false)
            .addClass('btn-sell');
          }
        }
          else{
            if(temp['btn-adopt'] == 2){
              petTemplate.find('.btn-default').text('Buy')
              .removeClass('btn-adopt')
              .removeClass('btn-sell')
              .removeClass('btn-adopt-free')
              .removeClass('btn-buy')
              .attr('data-id', i)
              .prop('disabled', false)
              .addClass('btn-buy');
            }else if( temp['btn-adopt'] == 1){
            petTemplate.find('.btn-default').text('Adopted')
            .removeClass('btn-adopt')
            .removeClass('btn-sell')
            .removeClass('btn-adopt-free')
            .removeClass('btn-buy')
            .addClass('btn-adopt')
            .attr('data-id', i)
            .prop('disabled', true);
          }else{
            petTemplate.find('.btn-default').text('Adopt')
            .removeClass('btn-adopt')
            .removeClass('btn-sell')
            .removeClass('btn-adopt-free')
            .removeClass('btn-buy')
            .attr('data-id', i)
            .prop('disabled', false)
            .addClass('btn-adopt');
          }
        }
          await petsRow.append(petTemplate.html());
        }
        App.displayAccountBalance();
        return App.displayMyPets();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handleAdopt: function (event) {
    console.log("handleAdopt");
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    // console.log(petId);
    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(async function (instance) {
        adoptionInstance = instance;
        console.log("petId",petId);
        // Execute adopt as a transaction by sending account
        return await adoptionInstance.adoptforpets(petId, { from: account });
        console.log("res",res);
        return res;
      }).then(function (result) {
        console.log("result",result);
        // Listen for the PetAdopted event
        adoptionInstance.PetAdopted({}, {fromBlock: 0, toBlock: 'latest'}).watch(function(error, event) {
          console.log(event);
          App.displayAccountBalance();
        });
        // App.displayAccountBalance();
        return App.markAdopted();
      });
    });
  },

  sellPet: function (event) {
    event.preventDefault();
    $('#confirmsell').attr('data-id', $(event.target).data('id'));
    // Show the modal window
    $('#sellpetModal').modal('show');
  },

  handleSell: function (event) {
    console.log("handleSell");
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    console.log(petId);
    var money = parseInt($('#inputmoney').val());
    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;

        // Execute sell as a transaction by sending account
        // console.log(petId);
        return adoptionInstance.sellPet(petId,money, { from: account });
      }).then(function (result) {
        $('#sellpetModal').modal('hide');
        $('#inputmoney').val('')
        // Listen for the PetSold event
        adoptionInstance.PetSold({}, {fromBlock: 0, toBlock: 'latest'}).watch(function(error, event) {
          console.log(event);
          App.displayAccountBalance();
        });

        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  // Add the handleBuy method
  handleBuy: function (event) {
    console.log("handleBuy");
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(async function (instance) {
        adoptionInstance = instance;
        var valuee = await adoptionInstance.getprice.call(petId);
        // Execute buy as a transaction by sending account and value
        // console.log(petId);
        return adoptionInstance.buyPet(petId, { from: account, value: web3.toWei(valuee, "gwei") });
      }).then(function (result) {
        // Listen for the PetBought event
        adoptionInstance.PetSold({}, {fromBlock: 0, toBlock: 'latest'}).watch(function(error, event) {
          console.log(event);
          App.displayAccountBalance();
        });

        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  addPet: function (event) {
    event.preventDefault();
  
    // Show the modal window
    $('#addPetModal').modal('show');
  },

  // Add the addPet method
  handleAddPet: function (event) {
    console.log("addPet");
    event.preventDefault();

    // var petDetails = $('#petDetails').val(); // Assuming there's an input with id 'petDetails' for pet details
    var name = $('#inputName').val();
    var age = parseInt($('#inputAge').val());
    var breed = $('#inputBreed').val();
    var location = $('#inputLocation').val();
    var image = $('#inputImage').val();
    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      
      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        // Execute addPet as a transaction by sending account
        return adoptionInstance.addpet(name,age,breed,location,"images/scottish-terrier.jpeg", { from: account });
      }).then(function (result) {
        // Listen for the PetAdded event
        $('#addPetModal').modal('hide');

        // Clear the input fields
        $('#inputName').val('');
        $('#inputAge').val('');
        $('#inputBreed').val('');
        $('#inputLocation').val('');
        $('#inputImage').val('');
  

        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  displayAccountBalance: function () {
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      $("#userAddress").text(account);
      web3.eth.getBalance(account, function (err, balance) {
        if (err) {
          console.log(err);
        } else {
          // console.log('Account balance: ' + web3.fromWei(balance, "ether") + ' ETH');
          $("#userBalance").text(web3.fromWei(balance, "ether"));
        }
      });
    });
  },

  displayPetsForAdoption: function () {
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;

      // Call getPetsForAdoption function from smart contract
      return adoptionInstance.getPetsForAdoption.call();
    }).then(function (petsForAdoption) {
      // display pets for adoption
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  displayPetsForSale: function () {
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;

      // Call getPetsForSale function from smart contract
      return adoptionInstance.getPetsForSale.call();
    }).then(function (petsForSale) {
      // display pets for sale
    }).catch(function (err) {
      console.log(err.message);
    });
  },
  displayMyPets: function () {
    var adoptionInstance;
    var temp={};
    console.log("displayMyPets");
    web3.eth.getAccounts(async function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      // console.log(account);
      await App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        // console.log(adoptionInstance);
      //   // Call getAdoptedPets function from smart contract
      return adoptionInstance.getAdopters_address.call();
      }).then(async function (adoptedPets) {
        console.log(adoptedPets);
        var myPetsRow = $('#myPetsRow');
        var petTemplate = $('#MypetTemplate');
        // console.log(myPetsRow.length);
        myPetsRow.empty();
        console.log(myPetsRow);
        for(var i = 0; i < adoptedPets.length; i++) {
          if (adoptedPets[i] !== account) {
            continue;
          }
          // console.log(adoptedPets[i]);
          // console.log('i='+i);
          // var tempp=i;
          temp['panel-title'] = await adoptionInstance.getptes_name.call(i);
          temp['img'] = await adoptionInstance.getptes_image.call(i);
          temp['pet-breed'] = await adoptionInstance.getptes_breed.call(i);
          temp['pet-age'] = await adoptionInstance.getptes_age.call(i);
          temp['pet-location'] = await adoptionInstance.getptes_location.call(i);
          temp['btn-adopt'] = await adoptionInstance.getptes_state.call(i);
          // console.log(temp);
          petTemplate.find('.panel-title').text(temp['panel-title']);
          petTemplate.find('img').attr('src', temp['img']);
          petTemplate.find('.pet-breed').text(temp['pet-breed']);
          petTemplate.find('.pet-age').text(temp['pet-age']);
          petTemplate.find('.pet-location').text(temp['pet-location']);
          // console.log(temp['btn-adopt']);
          if (temp['btn-adopt'] == 2) {
            petTemplate.find('.btn-default').text('Selling')
            .removeClass('btn-adopt')
            .removeClass('btn-sell')
            .removeClass('btn-adopt-free')
            .removeClass('btn-buy')
            .attr('data-id', i)
            .prop('disabled', true)
            .addClass('btn-sell');
          }else{
            petTemplate.find('.btn-default').text('Sell')
            .removeClass('btn-adopt')
            .removeClass('btn-sell')
            .removeClass('btn-adopt-free')
            .removeClass('btn-buy')
            .attr('data-id', i)
            .prop('disabled', false)
            .addClass('btn-sell');
          }
          await myPetsRow.append(petTemplate.html());
        }
          
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },
  
  // Other methods remain the same
};

function showTransparentModal(message) {
  var previousMessage = $('#transparentModalMessage').text();
  var newMessage = previousMessage + message;
  $('#transparentModalMessage').text(newMessage);
  $('#transparentModal').modal('show');
  
  // 设置定时器，一段时间后隐藏弹窗
  setTimeout(function() {
    hideTransparentModal();
  }, 3000); // 3秒后隐藏弹窗
}

function hideTransparentModal() {
  $('#transparentModal').modal('hide');
}

// Binding events
$(function () {
  $(document).on('click', '.btn-adopt', App.handleAdopt);
  $(document).on('click', '.btn-sell', App.sellPet);
  $(document).on('click', '.btn-buy', App.handleBuy);
  $(document).on('click', '#confirmAddPet', App.handleAddPet);
  $(document).on('click', '#Addbutton', App.addPet);
  $(document).on('click', '#confirmsell', App.handleSell);
  $(window).load(function () {
    App.init();
  });
});
