export const LATIN_CYRILLIC_LETTER_NAME_REGEX =
  /^[A-Za-zАаБбВвГгҐґДдЕеЁёЄєЭэЖжЗзІіЇїИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЮюЯя'-]+$/g
export const PHONE_REGEX = /^[1-9]\d{1,14}$/
export const PASSWORD_REGEX =
  /(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*_]{8,}/g
export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
