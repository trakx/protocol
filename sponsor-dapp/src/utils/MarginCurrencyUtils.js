const addressesToNames = {
  "0x188e7aC50648A2E44795eEF12cb54Cbf736de302": "DAI",
  "0xA7E2f86B4E2c241Ac6D2fb7cE9dEBb37DbB05093": "TUSD"
};

const namesToAddresses = {
  "DAI" : "0x188e7aC50648A2E44795eEF12cb54Cbf736de302",
  "TUSD" : "0xA7E2f86B4E2c241Ac6D2fb7cE9dEBb37DbB05093"
}


export function currencyAddressesToNames(params, inputArray) {
  let outputArray = [];
  for (let element of inputArray) {
    const name = currencyAddressToName(params, element);
    if (name != null) {
      outputArray.push(name);
    }
  }

  return outputArray;
}

export function namesToCurrencyAddresses(params, inputArray) {
  let outputArray = [];
  for (let element of inputArray) {
    const address = nameToCurrencyAddress(params, element);
    if (element != null) {
      outputArray.push(address);
    }
  }

  return outputArray;
}

export function nameToCurrencyAddress(params, name) {
  return namesToAddresses[name];
}

export function currencyAddressToName(params, address) {
  return addressesToNames[address];
}