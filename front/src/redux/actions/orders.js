import {
  GET_MY_ORDERS,
  GET_ORDERS,
  GET_ORDER,
  ADD_ORDERS,
  FILTER_ORDERS,
  UPDATE_ORDER,
  UPDATE_SINGLE_ORDER,
  PICKED_UP,
  UPDATE_MY_ORDER,
  ADD_MY_ORDER,
} from "../constants";
import axios from "axios";

export const postOrders = (ordenes) => {
  return axios.post("/api/order/excel", ordenes);
};

export const getOrders = function (orders) {
  return {
    type: GET_ORDERS,
    orders,
  };
};

export const addOrders = function (orders) {
  return {
    type: ADD_ORDERS,
    payload: orders,
  };
};

export const filterOrders = function (orderId) {
  return {
    type: FILTER_ORDERS,
    payload: orderId,
  };
};

export const updateOrder = (order) => ({
  type: UPDATE_ORDER,
  payload: order,
});

export const updateMyOrder = (order) => ({
  type: UPDATE_MY_ORDER,
  payload: order,
});

export const addMyOrder = function (order) {
  return {
    type: ADD_MY_ORDER,
    payload: order,
  };
};

export const updateSingleOrder = (order) => ({
  type: UPDATE_SINGLE_ORDER,
  payload: order,
});

const getMyOrders = function (orders) {
  return {
    type: GET_MY_ORDERS,
    payload: orders,
  };
};
const orderPickUp = function (mensaje) {
  return {
    type: PICKED_UP,
    payload: mensaje,
  };
};

export const postObservaciones = (observaciones, orderId) => (dispatch, state) => {
  const token = state().user.token;
  axios({
    method: "PUT",
    url: "/api/order/observaciones",
    headers: { Authorization: `Bearer ${token}` },
    data: { observaciones, orderId },
  }).then((res) => dispatch(fetchSingleOrder(orderId)));
};

export const deleteMessage = () => (dispatch) => {
  dispatch(orderPickUp(""));
};

export const fetchPickOrder = (orderId) => (dispatch, state) => {
  const token = state().user.token;
  axios({
    method: "PUT",
    url: "/api/order/",
    headers: { Authorization: `Bearer ${token}` },
    data: { orderId },
  }).then((res) => dispatch(orderPickUp(res.data)));
};

export const fetchOrders = () => (dispatch, state) => {
  const token = state().user.token;
  axios.get("/api/order/", { headers: { Authorization: `Bearer ${token}` } }).then((orders) => {
    dispatch(getOrders(orders.data));
  });
};

const getSingleOrder = function (order) {
  return {
    type: GET_ORDER,
    order,
  };
};

export const fetchSingleOrder = (id) => (dispatch, state) => {
  const token = state().user.token;
  axios
    .get(`/api/order/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((order) => {
      let parsedOrder = {
        ...order.data,
        products: JSON.parse(order.data.products),
        client: JSON.parse(order.data.client),
        destination: JSON.parse(order.data.destination),
      };
      return dispatch(getSingleOrder(parsedOrder));
    });
};

export const orderStateUpdate = (estado, id, userId) => (dispatch) => {
  axios.put(`/api/order/${id}`, { state: estado, userId }).then((order) => {
    let parsedOrder = {
      ...order.data,
      products: JSON.parse(order.data.products),
      client: JSON.parse(order.data.client),
      destination: JSON.parse(order.data.destination),
    };
    return dispatch(getSingleOrder(parsedOrder));
  });
};
export const fetchMyOrders = (page, filter) => (dispatch, state) => {
  const token = state().user.token;
  const query = queryGenerator(filter);
  axios
    .get(`/api/order/myorders/${page}${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      dispatch(getMyOrders(res.data));
    });
};

const queryGenerator = (querys) => {
  const estado = querys.estado.reduce((acc, value) => {
    return `${acc}estado[]=${value}&`;
  }, "?");
  let tienda = "";
  if (querys.tienda.id) tienda = querys.tienda.id;
  const result = `${estado}fecha=${JSON.stringify(querys.fecha)}&tienda=${tienda}`;
  return result;
};
