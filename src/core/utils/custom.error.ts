import { EError } from '../enums'

export const CError = {
  //NOTE: Authorization
  INACTIVE_USER: `${EError.INACTIVE_USER}: This user's account is not active. Please contact the superadmin to activate it.`,
  WRONG_PASSWORD: `${EError.WRONG_PASSWORD}: The password is wrong.`,
  NO_TOKEN: `${EError.NO_TOKEN}: There is no token in cookies. Nobody is logged in.`,
  NOT_LOGGED_IN: `${EError.NOT_LOGGED_IN}: Nobody is logged in.`,
  //NOTE: Not found
  NOT_FOUND_ID: `${EError.NOT_FOUND_ID}: An item with this id was not found.`,
  NOT_FOUND_PHONE: `${EError.NOT_FOUND_PHONE}: An item with this phone number was not found.`,
  NOT_FOUND_CLIENT_ID: `${EError.NOT_FOUND_CLIENT_ID}: A client with this clientId does not exist.`,
  NOT_FOUND_FILE: `${EError.NOT_FOUND_FILE}: A file was not found.`,
  NOT_FOUND_AVATAR: `${EError.NOT_FOUND_AVATAR}: This item does not have an avatar.`,
  NOT_FOUND_EMPLOYEE_ID: `${EError.NOT_FOUND_EMPLOYEE_ID}: An employee with this employeeId was not found.`,
  NOT_FOUND_ONGOING_SHIFT: `${EError.NOT_FOUND_ONGOING_SHIFT}: There is no ongoing shift.`,
  //NOTE: Already exists
  NAME_ALREADY_EXISTS: `${EError.NAME_ALREADY_EXISTS}: An item with this name already exists.`,
  PHONE_ALREADY_EXISTS: `${EError.PHONE_ALREADY_EXISTS}: An item with this phone already exists.`,
  TITLE_ALREADY_EXISTS: `${EError.TITLE_ALREADY_EXISTS}: There already exists an itme with this title.`,
  EMAIL_ALREADY_EXISTS: `${EError.EMAIL_ALREADY_EXISTS}: An item with this email already exists.`,
  ONGOING_SHIFT_ALREADY_EXISTS: `${EError.ONGOING_SHIFT_ALREADY_EXISTS}: There already exists an ongoing shift.`,
  //NOTE: File error
  NO_FILE_PROVIDED: `${EError.NO_FILE_PROVIDED}: No file was provided.`,
  FILE_ID_NOT_RELATED: `${EError.FILE_ID_NOT_RELATED}: The item has no related file with this id.`,
  FILE_ID_NOT_RELATED_TO_SECTION: `${EError.FILE_ID_NOT_RELATED_TO_SECTION}: A file with this id is not related to this file section.`,
  //NOTE: invalid data
  INVALID_PERMISSION: `${EError.INVALID_PERMISSION}: An invalid permission was provided.`,
  INVALID_POSITION: `${EError.INVALID_POSITION}: An invalid position was provided.`,
  INVALID_TENANT: `${EError.INVALID_TENANT}: Invalid tenant.`,
  //NOTE: superadmin error
  ATTEMPT_TO_EDIT_SUPERADMIN: `${EError.ATTEMPT_TO_EDIT_SUPERADMIN}: Superadmin cannot be edited through this endpoint.`,
  NOT_SUPERADMIN_ID: `${EError.NOT_SUPERADMIN_ID}: This is not superadmin's id.`,
  //NOTE: employee error
  INACTIVE_EMPLOYEE: `${EError.INACTIVE_EMPLOYEE}: The employee with this id is not active.`,
  ACTIVE_EMPLOYEE: `${EError.ACTIVE_EMPLOYEE}: The employee with this id is already active.`,
  //NOTE: work record error
  WRONG_PERCENT_SUM: `${EError.WRONG_PERCENT_SUM}: The sum of employee percent values are not equal to 1, which is 100%.`,
  NO_ONGOING_SHIFT: `${EError.NO_ONGOING_SHIFT}: Some employees have no ongoing shifts.`,
  WRONG_RECORD_GROUP_ID: `${EError.WRONG_RECORD_GROUP_ID}: The work record with the provided id is not related to the provided record group id.`,
  //NOTE: batch error
  WRONG_WAVE_ORDER: `${EError.WRONG_WAVE_ORDER}: Provided wave order is wrong.`,
  BATCH_ENDED: `${EError.BATCH_ENDED}: The batch with the provided id has already ended.`,
  WAVE_ENDED: `${EError.WAVE_ENDED}: The last wave of the batch with the provided id has already ended.`,
  CHAMBER_HAS_OPEN_BATCH: `${EError.CHAMBER_HAS_OPEN_BATCH}: This chamber has a batch that has not ended yet.`,
  SHIFT_ENDED: `${EError.SHIFT_ENDED}: The shift with the provided id has already ended.`,
  CHAMBER_HAS_NO_OPEN_BATCH: `${EError.CHAMBER_HAS_OPEN_BATCH}: This chamber has no open batch.`,
  WAVE_NOT_RELATED_TO_CHAMBER: `${EError.WAVE_NOT_RELATED_TO_CHAMBER}: The specified wave is not related to the specified chamber`,
  //NOTE: offload error
  WRONG_PRICE: `${EError.WRONG_PRICE}: The price per kg of each price group item should be the same.`,
  WRONG_STORAGE_DATA: `${EError.WRONG_STORAGE_DATA}: There is no storage of the provided date, variety, wave, category.`,
  WRONG_BOX_AMOUNT: `${EError.WRONG_BOX_AMOUNT}: The offload box amount exceeds the correspondent storage box amount.`,
  WRONG_WAVE_ID: `${EError.WRONG_WAVE_ID}: The provided wave id is not related to the provided batch id.`,
  WRONG_CATEGORY_ID: `${EError.WRONG_CATEGORY_ID}: The batch with the provided batch id has no subbatch related to the category with the provided category id.`,
  MISSING_OFFLOAD_RECORD_DATA: `${EError.MISSING_OFFLOAD_RECORD_DATA}: Some necessary offload record data was not provided.`,
  //NOTE cutting error
  BOX_QUANTITY_EXCEEDS_LIMIT: `${EError.BOX_QUANTITY_EXCEEDS_LIMIT}: The box quantity must be integer, minimum 1, maximum 99999.`,
}
