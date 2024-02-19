import { EError } from '../enums'

export const CError = {
  [EError.NOT_FOUND_PHONE]: 'An item with this phone number was not found.',
  [EError.INACTIVE_USER]:
    "This user's account is not active. Please contact the superadmin to activate it.",
  [EError.WRONG_PASSWORD]: 'The password is wrong.',
  [EError.NO_TOKEN]: 'There is no token in cookies. Nobody is logged in.',
  [EError.NOT_LOGGED_IN]: 'Nobody is logged in.',
  [EError.NOT_FOUND_ID]: 'An item with this id was not found.',
  [EError.NAME_ALREADY_EXISTS]: 'An item with this name already exists.',
  [EError.PHONE_ALREADY_EXISTS]: 'An item with this phone already exists.',
  [EError.NO_FILE_PROVIDED]: 'No file was provided.',
  [EError.NOT_FOUND_CLIENT_ID]: 'A client with this clientId does not exist.',
  [EError.FILE_ID_NOT_RELATED]: 'The item has no related file with this id.',
  [EError.EMAIL_ALREADY_EXISTS]: 'An item with this email already exists.',
  [EError.INVALID_PERMISSION]: 'An invalid permission was provided.',
  [EError.INVALID_POSITION]: 'An invalid position was provided.',
  [EError.ATTEMPT_TO_EDIT_SUPERADMIN]:
    'Superadmin cannot be edited through this endpoint.',
  [EError.NOT_SUPERADMIN_ID]: "This is not superadmin's id.",
  [EError.NOT_FOUND_AVATAR]: 'This item does not have an avatar.',
  [EError.NOT_FOUND_EMPLOYEE_ID]:
    'An employee with this employeeId was not found.',
  [EError.FILE_ID_NOT_RELATED_TO_SECTION]:
    'A file with this id is not related to this file section.',
  [EError.NOT_FOUND_FILE]: 'A file was not found.',
  [EError.TITLE_ALREADY_EXISTS]:
    'There already exists an itme with this title.',
}
