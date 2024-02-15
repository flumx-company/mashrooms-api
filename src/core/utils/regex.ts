export const LATIN_CYRILLIC_LETTER_NAME_REGEX =
  /^[A-Za-zАаБбВвГгҐґДдЕеЁёЄєЭэЖжЗзІіЇїИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЮюЯя'-]+$/g
export const PHONE_REGEX = new RegExp(
  `^[0-9]{1,${process.env.MAX_PHONE_LENGTH}}$`,
)
export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
export const BANK_CARD_NUMBER_REGEX = /^[0-9]{16}$/
