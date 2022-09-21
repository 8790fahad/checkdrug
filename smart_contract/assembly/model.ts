import { PersistentUnorderedMap, context, u128 } from "near-sdk-as";
export const listedDrug = new PersistentUnorderedMap<string, Drug>(
	"LISTED_PRODUCTS"
);

// drugs class which contains the all details of drugs
@nearBindgen
export class Drug {
	balance: u32;
	drug_name: string;
	price: u128;
	expiry_date: string;
	selling_price: u128;
	supplier_name: string;
	generic_name: string;
	reorder_level: u32;
	image: string;
	unit_of_issue: u32;
	drug_code: string;
	insert_time: string;
	owner: string;
	public static fromPayload(payload: Drug): Drug {
		const product = new Drug();
		product.drug_code = payload.drug_code;
		product.balance = payload.balance;
		product.image = payload.image;
		product.drug_name = payload.drug_name;
		product.price = payload.price;
		product.expiry_date = payload.expiry_date;
		product.selling_price = payload.selling_price;
		product.supplier_name = payload.supplier_name;
		product.generic_name = payload.generic_name;
		product.unit_of_issue = payload.unit_of_issue;
		product.insert_time = payload.insert_time;
		product.reorder_level = payload.reorder_level;
		product.owner = context.sender;
		return product;
	}

	// a public function that increases the drugs quantity when purchasing
	public increaseDrug(qty: u32, drug_code: string): void {
		const drug = listedDrug.get(drug_code);
		if (drug == null) throw new Error("drug not found");
		else drug.balance = drug.balance + qty;
		listedDrug.set(drug.drug_code, drug);
	}

	// a public function that decreases the drugs quantity when selling
	public decreaseDrug(
		qty: u32,
		drug_code: string,
		insert_time: string
	): void {
		const drug = listedDrug.get(drug_code);
		if (drug == null) throw new Error("drug not found");
		else {
			drug.insert_time = insert_time;
			drug.balance = drug.balance - qty;
		}
		listedDrug.set(drug.drug_code, drug);
	}

	// in case the price changes this function would update the selling price of the drugs
	public static updateDrugSellingPrice(
		drug_code: string,
		new_price: u128
	): void {
		const drug = listedDrug.get(drug_code);

		if (drug == null) throw new Error("drug not found");
		else {
			assert(
				drug.owner == context.sender,
				"You are not the drug's owner"
			);
			drug.selling_price = new_price;
			listedDrug.set(drug.drug_code, drug);
		}
	}
}

// this class is storing the history of the drugs

@nearBindgen
export class DrugListEntries {
	receive_date: string;
	drug_name: string;
	qty_in: u32;
	qty_out: u32;
	drug_code: string;
	expiry_date: string;
	selling_price: u128;
	insert_time: string;
	owner: string;
	// a payload function that would insert the record
	public static fromPayload(payload: DrugListEntries): DrugListEntries {
		const drug_list_entries = new DrugListEntries();
		drug_list_entries.receive_date = payload.receive_date;
		drug_list_entries.drug_name = payload.drug_name;
		drug_list_entries.qty_in = payload.qty_in;
		drug_list_entries.qty_out = payload.qty_out;
		drug_list_entries.drug_code = payload.drug_code;
		drug_list_entries.expiry_date = payload.expiry_date;
		drug_list_entries.selling_price = payload.selling_price;
		drug_list_entries.insert_time = payload.insert_time;
		drug_list_entries.owner = context.sender;
		return drug_list_entries;
	}
}

export const drugEntries = new PersistentUnorderedMap<string, DrugListEntries>(
	"DRUG_ENTRIES"
);
