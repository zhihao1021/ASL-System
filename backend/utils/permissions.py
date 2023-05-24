EDIT_ANNOUNCEMENT = 1 << 0

READ_CLASS_LIST = 1 << 1

READ_ALL_CLASS_DATA = 1 << 2

READ_SELF_STUDENT_LIST = 1 << 3
READ_ALL_STUDENT_LIST = 1 << 4

READ_SELF_STUDENT_DATA = 1 << 5
READ_ALL_STUDENT_DATA = 1 << 6

READ_SELF_LEAVE_DATA = 1 << 7
READ_ALL_LEAVE_DATA = 1 << 8


def combine_permissions(*args):
    result = 0
    for i in args:
        result |= i
    return result
