import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

interface GetIngredientsResponse {
  ingredients: TIngredient[];
}

interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const getIngredients = createAsyncThunk<
  GetIngredientsResponse,
  void,
  { rejectValue: string }
>('ingredients/getIngredients', async (_, { rejectWithValue }) => {
  try {
    const response = await getIngredientsApi();
    return { ingredients: response };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    isIngredientsLoadingSelector: (state) => state.isLoading
  },
  reducers: {},
  extraReducers(builder) {
    builder
      // Подгружаем все ингредиенты
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload.ingredients;
      });
  }
});

export const { ingredientsSelector, isIngredientsLoadingSelector } =
  ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
