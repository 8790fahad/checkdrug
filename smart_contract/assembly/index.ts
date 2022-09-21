import { PersistentUnorderedMap, u128 } from "near-sdk-as";
import { listedDrug, Drug, drugEntries, DrugListEntries } from "./model";
import { ContractPromiseBatch, context } from "near-sdk-as";
export const products = new PersistentUnorderedMap<string, string>("PRODUCTS");

// purchase the drugs function
export function setDrug(drug: Drug, receive_date: string): void {
	let storeDrug = listedDrug.get(drug.drug_code);
	if (
		storeDrug !== null &&
		storeDrug.supplier_name === drug.supplier_name &&
		storeDrug.expiry_date &&
		storeDrug.drug_code === drug.drug_code
	) {
		Drug.updateDrugSellingPrice(drug.drug_code, drug.selling_price);
		drug.increaseDrug(drug.balance, storeDrug.drug_code);
	}
	listedDrug.set(drug.drug_code, Drug.fromPayload(drug));
	const drugEnt: DrugListEntries = {
		receive_date: receive_date,
		drug_name: drug.drug_name,
		qty_in: drug.balance,
		qty_out: 0,
		drug_code: drug.drug_code,
		expiry_date: drug.expiry_date,
		selling_price: drug.selling_price,
		insert_time: drug.insert_time,
		owner: drug.owner,
	};
	drugEntries.set(drug.insert_time, DrugListEntries.fromPayload(drugEnt));
}

// get all the drug purchase
export function getDrugList(): Drug[] {
	return listedDrug.values();
}

// get particular drugs
export function getDrug(drug_code: string): Drug | null {
	return listedDrug.get(drug_code);
}

// update the drug price
export function updateDrugPrice(drug_code: string, new_price: u128): void {
	assert(new_price > u128.Min, "Invalid price");
	Drug.updateDrugSellingPrice(drug_code, new_price);
}

// sell the drug
export function buyDrug(
	drug_code: string,
	insert_time: string,
	receive_date: string,
	qty: u32
): void {
	// the date format's length will be exactly 19
	assert(
		insert_time.length == 19,
		"Date has to be in the format: YYYY-MM-DD hh:mm:ss"
	);
	// the date format's length will be exaclty 10
	assert(
		receive_date.length == 10,
		"Date has to be in the format: YYYY-MM-DD"
	);
	const _drug = getDrug(drug_code);

	if (_drug == null) {
		throw new Error("Medecine not found");
	} else {
		assert(
			qty <= _drug.balance,
			"Not enough drugs in stock to fulfill order"
		);
		let totalDue = u128.mul(u128.from(qty), _drug.price);
		assert(
			totalDue == context.attachedDeposit,
			`You need to send the total due: ${totalDue}`
		);
		// transfer near from buyer to seller
		ContractPromiseBatch.create(_drug.owner).transfer(
			context.attachedDeposit
		);
		// update the balance available
		_drug.decreaseDrug(qty, _drug.drug_code, insert_time);

		// insert into drug entries
		const drugEnt: DrugListEntries = {
			receive_date: receive_date,
			drug_name: _drug.drug_name,
			qty_in: 0,
			qty_out: qty,
			drug_code: _drug.drug_code,
			expiry_date: _drug.expiry_date,
			selling_price: _drug.selling_price,
			insert_time: insert_time,
			owner: _drug.owner,
		};
		drugEntries.set(
			_drug.insert_time,
			DrugListEntries.fromPayload(drugEnt)
		);
	}
}

// view drug history
export function viewDrugHistory(): DrugListEntries[] | null {
	return drugEntries.values();
}
