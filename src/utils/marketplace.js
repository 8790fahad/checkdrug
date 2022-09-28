import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import moment from "moment";
const GAS = 100000000000000;


export function getDrugs() {
  return window.contract.getDrugList();
}

export function updateDrugPrice(drug_code, new_price) {
  return window.contract.updateDrugPrice({ drug_code, new_price });
}

export function setDrug(drug) {
  const receive_date = moment().format("YYYY-MM-DD");
  drug.drug_code = uuid4();
  drug.id = uuid4(); 
  // parseNearAmount(drug.selling_price + "");
  drug.balance = parseInt(drug.balance);
  drug.unit_of_issue = parseInt(drug.unit_of_issue);
  drug.reorder_level = parseInt(drug.reorder_level);
  drug.insert_time = moment().format("YYYY-MM-DD hh:mm:ss");
  return window.contract.setDrug({ drug: drug, receive_date: receive_date });
}

export async function buyDrug({drug }) {
  await window.contract.buyDrug({
    drug_code:drug.drug_code,
    insert_time:moment().format("YYYY-MM-DD hh:mm:ss"),
    receive_date: moment().format("YYYY-MM-DD"),
    qty: drug.sold,
  }, GAS,parseNearAmount(drug.selling_price));
}

export function viewDrugHistory() {
  return window.contract.viewDrugHistory();
}

export function drugHistory() {
  return window.contract.drugHistory();
}
