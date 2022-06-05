import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import moment from "moment";
const GAS = 100000000000000;

export function createProduct(product) {
  product.id = uuid4();
  product.price = parseNearAmount(product.price + "");
  return window.contract.setProduct({ product });
}

export function getDrugs() {
  return window.contract.getDrugList();
}

export function updateDrugPrice(drug_code, new_price) {
  return window.contract.updateDrugPrice({ drug_code, new_price });
}

export function setDrug(drug) {
  const receive_date = moment().format("YYYY-MM-DD");
  drug.drug_code = uuid4();
  drug.balance = parseInt(drug.balance);
  drug.unit_of_issue = parseInt(drug.unit_of_issue);
  drug.insert_time = moment().format("YYYY-MM-DD hh:mm:ss");
  return window.contract.setDrug({ drug: drug, receive_date: receive_date });
}

export async function buyProduct({ id, price }) {
  await window.contract.buyProduct({ productId: id }, GAS, price);
}
