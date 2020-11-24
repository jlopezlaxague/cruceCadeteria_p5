import React from "react";
import XLSX from "xlsx";

export default () => {
  let orders = [];
  const handleInputChange = (e) => {
    const target = e.target;
    const fileExt = e.target.value.slice(e.target.value.indexOf("."));
    if (fileExt == ".xlsx" || fileExt == ".ods") {
      let reader = new FileReader();
      reader.readAsArrayBuffer(target.files[0]);
      reader.onloadend = (e) => {
        let data = new Uint8Array(e.target.result);
        let workBook = XLSX.read(data, { type: "array" });
        let planilla = XLSX.utils.sheet_to_row_object_array(
          workBook.Sheets[workBook.SheetNames]
        );
        planilla.map((order) =>
          orders.push({
            from: order.Origin,
            orderId: order.Order,
            creationDate: order["Creation Date"],
            client: JSON.stringify({
              name: order["Client Name"],
              lastName: order["Client Last Name"],
              email: order["Email"],
              phone: order["Phone"],
            }),
            destination: JSON.stringify({
              uf: order.UF,
              city: order.City,
              receiverName: order["Receiver Name"],
              street: order.Street,
              number: order.Number,
              complement: order.Complement ? order.Complement : "",
              neighbordhood: order.Neighbordhood ? order.Neighbordhood : "",
              reference: order.Reference ? order.Reference : "",
              postalCode: order["Postal Code"],
              estimatedDelivery: order["Estimate Delivery Date"],
              courier: order.Courrier,
            }),
            products: JSON.stringify({
              sku: order.ID_SKU,
              quantity: order.Quantity_SKU,
              name: order["SKU NAME"],
              skuValue: order["SKU VALUE"],
              discountsTotals: order["Discounts Totals"],
              shippingValue: order["Shipping Value"],
              totalValue: order["Total Value"],
            }),
          })
        );
        console.log(orders);
      };
    } else {
      alert(`${fileExt} extension not supported. Please use "xlsx"`);
    }
  };

  return (
    <input
      required
      type="file"
      name="file"
      id="file"
      onChange={handleInputChange}
      placeholder="Archivo XLSX"
    />
  );
};