import { useEffect, useState } from "react"
import './table.css';

function Table() {
  const [searchText, setSearchText] = useState('');

    const [tableData, setTableData] = useState([])
    const fetchTableData = () => {
      fetch(process.env.REACT_APP_GET_ORDERS_URL).then(response => {
        return response.json()
      }).then(data => {
        setTableData(data)        
      })
      
      
    }
    useEffect(() => {
      fetchTableData()
    }, [])

    useEffect(() => {
      console.log("tableData", tableData);
    }, [tableData]);

    const mapOrderStatus = (status) => {
      switch (status) {
        case "paid":
          return "Оплачен";
        case "dispensed":
          return "Выдан";
        case "accepted":
          return "Принят";
        case "ready":
          return "Готов";
        case "init":
          return "Создан"
        default:
          return "";
      }
    };

  return (
    <div className="table-container">
        <table id="orders">
          <thead>
            <tr>
                <th>Дата</th>
                <th>Номер заказа</th>
                <th>Состав заказа</th>
                <th>Статус заказа</th>
                <th>Статус оплаты</th>
                <th>Сумма</th>
                <th>ФИО</th>
                <th>Chat_ID</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Примечание</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <th></th>
                <th><input type="text" onChange={(e) => setSearchText(e.target.value)} /></th>
                <th></th>
                <th><input type="text" onChange={(e) => setSearchText(e.target.value)} /></th>
                <th><input type="text" onChange={(e) => setSearchText(e.target.value)} /></th>
                <th></th>
                <th><input type="text" onChange={(e) => setSearchText(e.target.value)} /></th>
                <th><input type="text" onChange={(e) => setSearchText(e.target.value)} /></th>
                <th><input type="text" onChange={(e) => setSearchText(e.target.value)} /></th>
                <th><input type="text" onChange={(e) => setSearchText(e.target.value)} /></th>
                <th></th>
            </tr>
          {tableData.length > 0 && tableData.map(row => (
                <tr key={row.order_id}>
                  <td>{row.order_date}</td>
                  <td>{row.order_id}</td>
                  <td>{row.order_content.join(", ")}</td>
                  <td>{mapOrderStatus(row.order_status)}</td>
                  <td>
                    <select aria-label="Default select example">
                      <option selected>{mapOrderStatus(row.payment_status)}</option>
                      <option value="refund">Возвращен</option>
                      <option value="paid">Оплачен</option>
                    </select>
                  </td>
                  <td>{row.total_price}</td>
                  <td>{`${row.client.first_name} ${row.client.second_name}`}</td>
                  <td>{row.client.chat_id}</td>
                  <td>{row.client.email}</td>
                  <td>{row.client.phone}</td>
                  <td>{row.order_comment}</td>
                </tr>
              ))}
          </tbody>
        </table>
    </div>
  );
}

export default Table;
