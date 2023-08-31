import { useEffect, useState } from "react";
import "./table.css";
import EditableCell from "../editableCell";
import ReactPaginate from "react-paginate";
import { DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import RefreshChecker from "../refreshChecker";
import dayjs from "dayjs";
import axios from "axios";

function Table() {
  const _ = require("lodash");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchOrderStatus, setSearchOrderStatus] = useState("");
  const [searchPaymentStatus, setSearchPaymentStatus] = useState("");
  const [searchSecondName, setSearchSecondName] = useState("");
  const [searchChatId, setSearchChatId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [isAllSelected, setAllSelected] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]); // State for checked checkboxes
  const [orderList, setOrderList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState("");
  const [calendarFilterDates, SetCalendarFilterDates] = useState([]);
  const [searchFilterDates, setSearchFilterDates] = useState([]); // for pagination fetch
  const dateFormat = "YYYY-MM-DD";
  const [daysToSearch, setDaysToSearch] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const { RangePicker } = DatePicker;

  const getTodayDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const getPastDateFromNow = (number) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - number);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };


  const fetchPaginatedTableData = async (start_date, end_date) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_GET_ORDERS_URL}?start_date=${
          start_date || getTodayDate()
        }&end_date=${end_date || getTodayDate()}&page=${page}`
      );
      setTableData(response.data.orders);
      setPageCount(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    } else {
      setPage(1)
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    getPastTableData(daysToSearch);
  }, [page]);

  const handleSelectAll = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !isAllSelected;
    });
    setAllSelected(!isAllSelected);

    if (!isAllSelected) {
      setOrderList(
        Array.from(checkboxes)
          .slice(1)
          .map((checkbox) => checkbox.id)
      );
    } else {
      setOrderList([]);
    }
  };

  const handleCheckboxChange = (e) => {
    const checkboxId = e.target.id;
    const isChecked = e.target.checked;

    if (isChecked) {
      setOrderList((orderList) => [...orderList, checkboxId]);
    } else {
      setOrderList((orderList) =>
        orderList.filter((item) => item !== checkboxId)
      );
    }
  };

  useEffect(() => {
    setOrderList(checkedItems);
    console.log(orderList);
  }, [tableData, checkedItems]);

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
        return "Создан";
      default:
        return "";
    }
  };

  const onDateChoose = (date, dateString) => {
    setDateRange(dateString);
  };

  const onDateSubmit = (date, dateString) => {
    if (dateRange) {
      console.log(dateRange);
      fetchPaginatedTableData(dateRange[0], dateRange[1]);
      setSearchFilterDates([dateRange[0], dateRange[1]]);
      SetCalendarFilterDates([
        dayjs(dateRange[0], dateFormat),
        dayjs(dateRange[1], dateFormat),
      ]);
    }
  };

  const getPastTableData = (numberOfDays) => {
    console.log("Fetch past data");
    let yesterdayDate = dayjs(getPastDateFromNow(numberOfDays), dateFormat);
    let todayDate = dayjs(getTodayDate(), dateFormat);
    SetCalendarFilterDates([yesterdayDate, todayDate]);
    setSearchFilterDates([getPastDateFromNow(numberOfDays), getTodayDate()]);
    fetchPaginatedTableData(getPastDateFromNow(numberOfDays));
  };

  const getMonthlyTableData = () => {
    console.log("Fetch monthly data");
    getPastTableData(31);
    setDaysToSearch(31);
  };

  const getWeeklyTableData = () => {
    console.log("Fetch weekly data");
    getPastTableData(7);
    setDaysToSearch(7);
  };

  const getYesterdayTableData = () => {
    console.log("Fetch yesterday data");
    getPastTableData(1);
    setDaysToSearch(1);
  };

  const getTodayTableData = () => {
    console.log("Fetch today data");
    let todayDate = dayjs(getTodayDate(), dateFormat);
    SetCalendarFilterDates([todayDate, todayDate]);
    setSearchFilterDates([getTodayDate(), getTodayDate()]);
    fetchPaginatedTableData();
  };

  const startRefund = async () => {
    console.log(orderList);
    try {
      const response = await fetch(
        process.env.REACT_APP_START_REFUND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orders: orderList }),
      });

      if (response.ok) {
        console.log("Refunds initated", response);
      } else {
        console.log("Failed to start refunds");
      }
    } catch (error) {
      console.log("Error refunding:", error);
    }
  };

  const search = async (filterField, filterQuery) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_FILTER_URL}?filter_field=${filterField}&filter_query=${filterQuery}`
      );
      setTableData(response.data.orders);
      setPageCount(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrderIdInputChange = (e) => {
    const val = e.target.value;
    debouncedSearchOrder(val);
  };

  const handleStatusInputChange = (e) => {
    const val = e.target.value;
    debouncedSearchStatus(val);
  };

  const handlePaymentStatusInputChange = (e) => {
    const val = e.target.value;
    debouncedSearchPaymentStatus(val);
  };

  const handleSecondNameInputChange = (e) => {
    const val = e.target.value;
    debouncedSearchSecondName(val);
  };

  const handleChatIDInputChange = (e) => {
    const val = e.target.value;
    debouncedSearchChatID(val);
  };

  const handleEmailInputChange = (e) => {
    const val = e.target.value;
    debouncedSearchEmail(val);
  };

  const handlePhoneInputChange = (e) => {
    const val = e.target.value;
    debouncedSearchPhone(val);
  };

  const debouncedSearchOrder = _.debounce((q) => {
    setSearchOrderId(q);
  }, 1500);

  const debouncedSearchStatus = _.debounce((q) => {
    setSearchOrderStatus(q);
  }, 1500);

  const debouncedSearchPaymentStatus = _.debounce((q) => {
    setSearchPaymentStatus(q);
  }, 1500);

  const debouncedSearchSecondName = _.debounce((q) => {
    setSearchSecondName(q);
  }, 1500);

  const debouncedSearchChatID = _.debounce((q) => {
    setSearchChatId(q);
  }, 1500);

  const debouncedSearchEmail = _.debounce((q) => {
    setSearchEmail(q);
  }, 1500);

  const debouncedSearchPhone = _.debounce((q) => {
    setSearchPhone(q);
  }, 1500);

  useEffect(() => {
    if (searchOrderId.length > 0) {
      search("cooking_id", searchOrderId);
      console.log("searching for cooking_id", searchOrderId);
    }
  }, [searchOrderId]);

  useEffect(() => {
    if (searchOrderStatus.length > 0) {
      search("order_status", searchOrderStatus);
      console.log("searching for order status", searchOrderStatus);
    }
  }, [searchOrderStatus]);

  useEffect(() => {
    if (searchPaymentStatus.length > 0) {
      search("payment_status", searchPaymentStatus);
      console.log("searching for payment status", searchPaymentStatus);
    }
  }, [searchPaymentStatus]);

  useEffect(() => {
    if (searchSecondName.length > 0) {
      search("second_name", searchSecondName);
      console.log("searching for second name", searchSecondName);
    }
  }, [searchSecondName]);

  useEffect(() => {
    if (searchChatId.length > 0) {
      search("chat_id", searchChatId);
      console.log("searching for chat_id", searchChatId);
    }
  }, [searchChatId]);

  useEffect(() => {
    if (searchEmail.length > 0) {
      search("email", searchEmail);
      console.log("searching for email", searchEmail);
    }
  }, [searchEmail]);

  useEffect(() => {
    if (searchPhone.length > 0) {
      search("phone", searchPhone);
      console.log("searching for phone", searchPhone);
    }
  }, [searchPhone]);

  return (
    <div className="main-container">
      <div className="search-container">
        <div className="period-container">
          <RangePicker
            onChange={onDateChoose}
            value={calendarFilterDates}
            locale={locale}
            format={dateFormat}
          />
          <button id="range-choose-btn" onClick={onDateSubmit}>
            Выбрать
          </button>
          <button onClick={getMonthlyTableData}>За месяц</button>
          <button onClick={getWeeklyTableData}>За неделю</button>
          <button onClick={getYesterdayTableData}>Вчера</button>
          <button onClick={getTodayTableData}>Сегодня</button>
        </div>
        <div className="action-buttons-container">
          <button id="refund-btn" onClick={startRefund}>
            Оформить возврат денег
          </button>
        </div>
      </div>
      <div className="table-container">
        <table id="orders">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  id="checkbox-all"
                  onChange={handleSelectAll}
                ></input>
              </th>
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
              <th></th>
              <th>
                <input type="text" onChange={handleOrderIdInputChange} />
              </th>
              <th></th>
              <th>
                <input type="text" onChange={handleStatusInputChange} />
              </th>
              <th>
                <input type="text" onChange={handlePaymentStatusInputChange} />
              </th>
              <th></th>
              <th>
                <input type="text" onChange={handleSecondNameInputChange} />
              </th>
              <th>
                <input type="text" onChange={handleChatIDInputChange} />
              </th>
              <th>
                <input type="text" onChange={handleEmailInputChange} />
              </th>
              <th>
                <input type="text" onChange={handlePhoneInputChange} />
              </th>
              <th></th>
            </tr>
            {tableData.length > 0 &&
              tableData.map((row) => (
                <tr key={row.order_id}>
                  <td>
                    <input
                      type="checkbox"
                      id={row.order_id}
                      onChange={handleCheckboxChange}
                    ></input>
                  </td>
                  <td>{row.order_date}</td>
                  <td>{row.cooking_id}</td>
                  <td>{row.order_content.join(", ")}</td>
                  <td>{mapOrderStatus(row.order_status)}</td>
                  <td>{mapOrderStatus(row.payment_status)}</td>
                  <td>{row.total_price}</td>
                  <td>{`${row.client.first_name} ${row.client.second_name}`}</td>
                  <td>{row.client.chat_id}</td>
                  <td>{row.client.email}</td>
                  <td>{row.client.phone}</td>
                  <EditableCell
                    orderId={row.order_id}
                    initialValue={row.order_comment || "..."}
                  />
                </tr>
              ))}
          </tbody>
        </table>
        <div className="next-prev-page-buttons">
          <button
            className="prev-btn"
            onClick={handlePrevPage}
            disabled={pageCount <= 1 || page == 1}
          >
            Назад
          </button>
          <button onClick={handleNextPage} disabled={pageCount <= 1 || page == pageCount - 1}>
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
