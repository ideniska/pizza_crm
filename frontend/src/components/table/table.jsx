import { useEffect, useState } from "react";
import "./table.css";
import EditableCell from "../editableCell";
import { DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import axios from "axios";

function Table() {
  const _ = require("lodash");
  const [searchCookingOrderId, setSearchCookingOrderId] = useState("None");
  const [searchPaymentStatus, setSearchPaymentStatus] = useState("None");
  const [searchSecondName, setSearchSecondName] = useState("None");
  const [searchChatId, setSearchChatId] = useState("None");
  const [searchEmail, setSearchEmail] = useState("None");
  const [searchPhone, setSearchPhone] = useState("None");
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
  const [shouldFetch, setShouldFetch] = useState(true)
  const { RangePicker } = DatePicker;
  const [searchStatusValue, setSearchStatusValue] = useState("None");


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
        }&end_date=${end_date || getTodayDate()}&page=${page}&cooking_id=${searchCookingOrderId}&cooking_status=${searchStatusValue}&payment_status=${searchPaymentStatus}&second_name=${searchSecondName}&chat_id=${searchChatId}&email=${searchEmail}&phone=${searchPhone}`
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
      setShouldFetch(true);
    } else {
      setPage(1)
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
    setShouldFetch(true);
  };

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
    let pastDate = dayjs(getPastDateFromNow(numberOfDays), dateFormat);
    let todayDate = dayjs(getTodayDate(), dateFormat);
    SetCalendarFilterDates([pastDate, todayDate]);
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
          window.alert('Процедура возврата запущена.');
          const checkboxes = document.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
      });
          setOrderList([]);
          console.log(orderList);
        } else {
          console.log("Failed to start refunds");
        }
      } catch (error) {
        console.log("Error refunding:", error);
      }
    
  };

  const handleCookingIdInputChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      debouncedSearchCookingId.cancel();
      setSearchCookingOrderId("None");
      setShouldFetch(true);
    } else {
      debouncedSearchCookingId(val);
    }
  };

  const handleStatusInputChange = (e) => {
    setSearchStatusValue(e.target.value);
    setShouldFetch(true);
  }

  const handleSecondNameInputChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      debouncedSearchSecondName.cancel();
      setSearchSecondName("None");
      setShouldFetch(true);
    } else {
      debouncedSearchSecondName(val);
    }
  };
  
  const handleChatIDInputChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      debouncedSearchChatID.cancel();
      setSearchChatId("None");
      setShouldFetch(true);
    } else {
      debouncedSearchChatID(val);
    }
  };
  
  const handleEmailInputChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      debouncedSearchEmail.cancel();
      setSearchEmail("None");
      setShouldFetch(true);
    } else {
      debouncedSearchEmail(val);
    }
  };
  
  const handlePhoneInputChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      debouncedSearchPhone.cancel();
      setSearchPhone("None");
      setShouldFetch(true);
    } else {
      debouncedSearchPhone(val);
    }
  };

  const debouncedSearchCookingId = _.debounce((q) => {
    setSearchCookingOrderId(q);
    setShouldFetch(true);
  }, 1500);

  const debouncedSearchSecondName = _.debounce((q) => {
    setSearchSecondName(q);
    setShouldFetch(true);
  }, 1500);

  const debouncedSearchChatID = _.debounce((q) => {
    setSearchChatId(q);
    setShouldFetch(true);
  }, 1500);

  const debouncedSearchEmail = _.debounce((q) => {
    setSearchEmail(q);
    setShouldFetch(true);
  }, 1500);

  const debouncedSearchPhone = _.debounce((q) => {
    setSearchPhone(q);
    setShouldFetch(true);
  }, 1500);

  useEffect(() => {
    if (shouldFetch) {
      getPastTableData(daysToSearch);
      setShouldFetch(false);
    }
  }, [shouldFetch]);

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
          <button id="refund-btn" onClick={startRefund} disabled={orderList.length === 0}
>
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
              <th>Статус приготовления</th>
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
                <input type="text" onChange={handleCookingIdInputChange} />
              </th>
              <th></th>
              <th>
                <div>
                    <select
                      value={searchStatusValue}
                      onChange={handleStatusInputChange}
                    >
                      <option value="None">Все статусы</option>
                      <option value="init">Создан</option>
                      <option value="accepted">Принят</option>
                      <option value="cooking">Готовится</option>
                      <option value="ready">Готов</option>
                      <option value="dispensed">Выдан</option>
                      <option value="error">Ошибка</option>
                    </select>
                  </div>
              </th>
              <th>
                {/* <div>
                    <select
                      value={searchPaymentStatus}
                      onChange={handlePaymentStatusInputChange}
                    >
                      <option value="paid">Оплачен</option>
                      <option value="init">Создан</option>
                      <option value="refund_started">Возврат запущен</option>
                      <option value="refund">Возвращен</option>
                      <option value="cancel_started">Отмена запущена</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </div> */}
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
                  <td>{mapOrderStatus(row.cooking_status)}</td>
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
          <button onClick={handleNextPage} disabled={pageCount <= 1 || page == pageCount - 2}>
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
