
export interface IPsalmString {
  n: number;  // номер строки
  i?: string; // номер строки цс
  t?: number; // если строка заголовок
  v: string   // текст

  p?: number; // 1, 2 или 3 часть 118-го псалма
  s?: number; // среда 118-го псалма

  // генерируемые поля
  v2?: string // второй перевод
  n2?: number // номер строки перевода (возможно цс)
}

export interface IPsalm {
  id: string;               // номер псалма
  strings: IPsalmString[];  // строки
  isDivided?: boolean;      // если 118-й псалом
}

export interface IPsalmsList {
  1: IPsalm;
  2: IPsalm;
  3: IPsalm;
  4: IPsalm;
  5: IPsalm;
  6: IPsalm;
  7: IPsalm;
  8: IPsalm;
  9: IPsalm;
  10: IPsalm;
  11: IPsalm;
  12: IPsalm;
  13: IPsalm;
  14: IPsalm;
  15: IPsalm;
  16: IPsalm;
  17: IPsalm;
  18: IPsalm;
  19: IPsalm;
  20: IPsalm;
  21: IPsalm;
  22: IPsalm;
  23: IPsalm;
  24: IPsalm;
  25: IPsalm;
  26: IPsalm;
  27: IPsalm;
  28: IPsalm;
  29: IPsalm;
  30: IPsalm;
  31: IPsalm;
  32: IPsalm;
  33: IPsalm;
  34: IPsalm;
  35: IPsalm;
  36: IPsalm;
  37: IPsalm;
  38: IPsalm;
  39: IPsalm;
  40: IPsalm;
  41: IPsalm;
  42: IPsalm;
  43: IPsalm;
  44: IPsalm;
  45: IPsalm;
  46: IPsalm;
  47: IPsalm;
  48: IPsalm;
  49: IPsalm;
  50: IPsalm;
  51: IPsalm;
  52: IPsalm;
  53: IPsalm;
  54: IPsalm;
  55: IPsalm;
  56: IPsalm;
  57: IPsalm;
  58: IPsalm;
  59: IPsalm;
  60: IPsalm;
  61: IPsalm;
  62: IPsalm;
  63: IPsalm;
  64: IPsalm;
  65: IPsalm;
  66: IPsalm;
  67: IPsalm;
  68: IPsalm;
  69: IPsalm;
  70: IPsalm;
  71: IPsalm;
  72: IPsalm;
  73: IPsalm;
  74: IPsalm;
  75: IPsalm;
  76: IPsalm;
  77: IPsalm;
  78: IPsalm;
  79: IPsalm;
  80: IPsalm;
  81: IPsalm;
  82: IPsalm;
  83: IPsalm;
  84: IPsalm;
  85: IPsalm;
  86: IPsalm;
  87: IPsalm;
  88: IPsalm;
  89: IPsalm;
  90: IPsalm;
  91: IPsalm;
  92: IPsalm;
  93: IPsalm;
  94: IPsalm;
  95: IPsalm;
  96: IPsalm;
  97: IPsalm;
  98: IPsalm;
  99: IPsalm;
  100: IPsalm;
  101: IPsalm;
  102: IPsalm;
  103: IPsalm;
  104: IPsalm;
  105: IPsalm;
  106: IPsalm;
  107: IPsalm;
  108: IPsalm;
  109: IPsalm;
  110: IPsalm;
  111: IPsalm;
  112: IPsalm;
  113: IPsalm;
  114: IPsalm;
  115: IPsalm;
  116: IPsalm;
  117: IPsalm;
  118: IPsalm;
  119: IPsalm;
  120: IPsalm;
  121: IPsalm;
  122: IPsalm;
  123: IPsalm;
  124: IPsalm;
  125: IPsalm;
  126: IPsalm;
  127: IPsalm;
  128: IPsalm;
  129: IPsalm;
  130: IPsalm;
  131: IPsalm;
  132: IPsalm;
  133: IPsalm;
  134: IPsalm;
  135: IPsalm;
  136: IPsalm;
  137: IPsalm;
  138: IPsalm;
  139: IPsalm;
  140: IPsalm;
  141: IPsalm;
  142: IPsalm;
  143: IPsalm;
  144: IPsalm;
  145: IPsalm;
  146: IPsalm;
  147: IPsalm;
  148: IPsalm;
  149: IPsalm;
  150: IPsalm;
  151: IPsalm;
}
