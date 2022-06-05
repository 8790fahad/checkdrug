import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getDrugs, updateDrugPrice } from "../../utils/marketplace";
import Loader from "../../utils/loader";
function InventoryList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const getDrugsList = useCallback(async () => {
    try {
      setLoading(true);
      let drugs = await getDrugs();
      const arr = [];
      drugs && drugs.map((item) => arr.push({ ...item, enable: false }));
      setDrugs(arr);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);
  const updateSellingPrice = async (item_code, new_price) => {
    try {
      setUpdateLoading(true);
      await updateDrugPrice(item_code, new_price);
      getDrugsList()
    } catch {
      setUpdateLoading(false);
    } finally {
      setUpdateLoading(false);
    }
  };
  useEffect(() => {
    getDrugsList();
  }, [getDrugsList]);
  const enableEdit = (item, index) => {
    const arr = [];
    drugs.forEach((ite, ind) => {
      if (index === ind) {
        arr.push({ ...item, enable: !item.enable });
      } else {
        arr.push({ ...ite, enable: false });
      }
    });
    setDrugs(arr);
  };
  const ChangeSellingPrice = (item, index, value) => {
    const arr = [];
    drugs.forEach((ite, ind) => {
      if (index === ind) {
        arr.push({ ...item, selling_price: value });
      } else {
        arr.push(ite);
      }
    });
    setDrugs(arr);
  };
  return (
    <Container className="mt-3">
      <Card centered>
        <Card.Header>
          <Card.Title>
            <Row>
              <Col md={5}>
                <Button size="sm" variant="dark" onClick={() => navigate(-1)}>
                  Back <i className="bi arrow-back" />
                </Button>
              </Col>
              <Col md={2}>
                <div className="text-center">Drugs Inventory</div>
              </Col>
            </Row>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Button
            variant="dark"
            size="sm"
            onClick={() => {
              navigate("/add-new-drug");
            }}
          >
            Add New Drug
          </Button>
          {loading ? <Loader /> : ""}
          <Table striped bordered className="mt-2">
            <thead>
              <tr>
                <th className="text-center">Edit</th>
                <th className="text-center">Supplier Name</th>
                <th className="text-center">Drug Name</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Selling Price</th>
                <th className="text-center">Owner</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {drugs &&
                drugs.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">
                      {item.enable ? (
                        <>
                          <Button
                            size="sm"
                            variant="dark"
                            onClick={() => {
                              updateSellingPrice(
                                item.drug_code,
                                item.selling_price
                              );
                            }}
                          >
                            {updateLoading ? (
                              <Spinner
                                animation="border"
                                role="status"
                                size="sm"
                                className="opacity-25"
                              ></Spinner>
                            ) : (
                              "Update"
                            )}
                          </Button>
                          {"  "}
                          <Button
                            size="sm"
                            variant="outline-dark"
                            outline
                            onClick={() => {
                              enableEdit(item, index);
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="dark"
                          onClick={() => {
                            enableEdit(item, index);
                          }}
                        >
                          edit
                        </Button>
                      )}
                    </td>
                    <td>{item.supplier_name}</td>
                    <td>{`${item.drug_name} (${item.generic_name})`}</td>
                    <td className="text-center">{item.balance}</td>
                    <td className="text-end">
                      {item.enable ? (
                        <Form.Control
                          type="number"
                          placeholder="Enter Selling Price"
                          size="sm"
                          value={item.selling_price}
                          onChange={({ target: { value } }) => {
                            ChangeSellingPrice(item, index, value);
                          }}
                        />
                      ) : (
                        item.selling_price
                      )}
                    </td>
                    <td>{item.owner}</td>
                    <td className="text-center">
                      <Button size="sm" variant="dark">
                        view
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {!drugs.length ? (
            <Alert size="sm" className="text-center">
              {" "}
              No data to display
            </Alert>
          ) : (
            ""
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default InventoryList;
