import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Material {
  id: string;
  name: string;
  pricePerTrip: number;
  unit: string;
}

export interface TruckType {
  id: string;
  name: string;
  capacity: string;
  priceMultiplier: number;
}

export interface OrderState {
  selectedMaterial: Material | null;
  selectedTruck: TruckType | null;
  quantity: number;
  distance: number;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  totalPrice: number;
  orders: Order[];
}

export interface Order {
  id: string;
  material: Material;
  truck: TruckType;
  quantity: number;
  distance: number;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed';
  createdAt: string;
}

const materials: Material[] = [
  { id: '1', name: 'Sand', pricePerTrip: 2500, unit: 'per trip' },
  { id: '2', name: 'Gravel', pricePerTrip: 3000, unit: 'per trip' },
  { id: '3', name: 'Stone Chips', pricePerTrip: 2800, unit: 'per trip' },
  { id: '4', name: 'Brick', pricePerTrip: 3500, unit: 'per trip' },
  { id: '5', name: 'Cement', pricePerTrip: 4000, unit: 'per trip' },
];

const truckTypes: TruckType[] = [
  { id: '1', name: 'Ashok Leyland', capacity: '10 tons', priceMultiplier: 1.0 },
  { id: '2', name: 'TATA', capacity: '12 tons', priceMultiplier: 1.2 },
  { id: '3', name: 'Howo', capacity: '15 tons', priceMultiplier: 1.5 },
];

const initialState: OrderState = {
  selectedMaterial: null,
  selectedTruck: null,
  quantity: 1,
  distance: 0,
  customerInfo: {
    name: '',
    phone: '',
    email: '',
    address: '',
  },
  totalPrice: 0,
  orders: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setSelectedMaterial: (state, action: PayloadAction<Material>) => {
      state.selectedMaterial = action.payload;
      state.totalPrice = calculateTotal(state);
    },
    setSelectedTruck: (state, action: PayloadAction<TruckType>) => {
      state.selectedTruck = action.payload;
      state.totalPrice = calculateTotal(state);
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
      state.totalPrice = calculateTotal(state);
    },
    setDistance: (state, action: PayloadAction<number>) => {
      state.distance = action.payload;
      state.totalPrice = calculateTotal(state);
    },
    setCustomerInfo: (state, action: PayloadAction<Partial<OrderState['customerInfo']>>) => {
      state.customerInfo = { ...state.customerInfo, ...action.payload };
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    resetOrder: (state) => {
      state.selectedMaterial = null;
      state.selectedTruck = null;
      state.quantity = 1;
      state.distance = 0;
      state.customerInfo = {
        name: '',
        phone: '',
        email: '',
        address: '',
      };
      state.totalPrice = 0;
    },
  },
});

function calculateTotal(state: OrderState): number {
  if (!state.selectedMaterial || !state.selectedTruck) return 0;
  
  const baseCost = state.selectedMaterial.pricePerTrip * state.quantity;
  const truckMultiplier = state.selectedTruck.priceMultiplier;
  const distanceMultiplier = 1 + (state.distance * 0.05); // 5% increase per km
  
  return Math.round(baseCost * truckMultiplier * distanceMultiplier);
}

export { materials, truckTypes };
export const {
  setSelectedMaterial,
  setSelectedTruck,
  setQuantity,
  setDistance,
  setCustomerInfo,
  addOrder,
  updateOrderStatus,
  resetOrder,
} = orderSlice.actions;

export default orderSlice.reducer;