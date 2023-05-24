from aiosqlmodel import AsyncSession
from config import ENGINE

from os import getenv

from sqlmodel import SQLModel


async def sql_init():
    DEBUG = getenv("DEBUG", "False").lower() == "true"
    async with ENGINE.begin() as conn:
        if DEBUG:
            await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)

    if DEBUG:
        async with AsyncSession(ENGINE) as session:
            from models import User, Class, LeaveType, Lesson, Role, Status
            from utils import permissions
            from utils.permissions import combine_permissions

            # 假別
            for i, name in enumerate(["事假", "病假", "喪假", "生理假", "其他"]):
                session.add(LeaveType(leave_code=i, leave_name=name))
            # 節次
            for i, name in enumerate(["早自修", "第一節", "第二節", "第三節", "第四節", "午休", "第五節", "第六節", "第七節", "第八節", "第九節"]):
                session.add(Lesson(lesson_code=i, lesson_name=name))
            # 請假狀態
            for i, name in enumerate([
                "等待導師核准",    # 0
                "等待教官核准",    # 1
                "等待學務主任核准", # 2
                "等待校長核准",    # 3
                "導師退回",        # 4
                "教官退回",        # 5
                "學務主任退回",    # 6
                "校長退回",        # 7
                "完成",           # 8
            ]):
                status_type = 0
                if i == 8:
                    status_type = 1
                elif i > 3:
                    status_type = 2
                session.add(
                    Status(status_code=i, status_title=name, status_type=status_type))

            # 身份組
            session.add(Role(role_code=0, role_name="Admin",
                        permissions=(1 << 9) - 1))
            session.add(Role(role_code=1, role_name="學生", accept_status=0))
            session.add(Role(role_code=2, role_name="老師", permissions=combine_permissions(
                permissions.READ_SELF_STUDENT_LIST,
                permissions.READ_SELF_STUDENT_DATA,
                permissions.READ_SELF_LEAVE_DATA,
            ), search_status=0, accept_status=1, reject_status=4))

            READ_ALL_DATA = combine_permissions(
                permissions.EDIT_ANNOUNCEMENT,
                permissions.READ_ALL_CLASS_DATA,
                permissions.READ_ALL_STUDENT_LIST,
                permissions.READ_ALL_STUDENT_DATA,
                permissions.READ_ALL_LEAVE_DATA,
            )
            session.add(Role(role_code=3, role_name="生輔組", permissions=READ_ALL_DATA,
                        search_status=1, accept_status=2, reject_status=5, late_status=3, late_days=3))
            session.add(Role(role_code=4, role_name="學務主任", permissions=READ_ALL_DATA,
                        search_status=2, accept_status=8, reject_status=6,))
            session.add(Role(role_code=5, role_name="校長", permissions=READ_ALL_DATA,
                        search_status=3, accept_status=8, reject_status=7,))
            session.add(Role(role_code=6, role_name="export", permissions=READ_ALL_DATA))

            # 班級
            session.add(Class(class_code=0, class_name="01"))
            session.add(Class(class_code=1, class_name="02"))

            # 帳戶
            session.add(
                User(**{
                    "sid": "000",
                    "name": "admin",
                    "account": "admin",
                    "password": "admin",
                    "role": 0
                })
            )
            session.add(
                User(**{
                    "sid": "001",
                    "name": "student-1",
                    "account": "student-1",
                    "password": "student-1",
                    "role": 1,
                    "class_code": 0
                })
            )
            session.add(
                User(**{
                    "sid": "002",
                    "name": "student-2",
                    "account": "student-2",
                    "password": "student-2",
                    "role": 1,
                    "class_code": 1
                })
            )
            session.add(
                User(**{
                    "sid": "003",
                    "name": "teacher-1",
                    "account": "teacher-1",
                    "password": "teacher-1",
                    "role": 2,
                    "class_code": 0
                })
            )
            session.add(
                User(**{
                    "sid": "004",
                    "name": "teacher-2",
                    "account": "teacher-2",
                    "password": "teacher-2",
                    "role": 2,
                    "class_code": 1
                })
            )
            session.add(
                User(**{
                    "sid": "005",
                    "name": "生輔組",
                    "account": "a-1",
                    "password": "a-1",
                    "role": 3,
                })
            )
            session.add(
                User(**{
                    "sid": "006",
                    "name": "學務主任",
                    "account": "a-2",
                    "password": "a-2",
                    "role": 4,
                })
            )
            session.add(
                User(**{
                    "sid": "007",
                    "name": "校長",
                    "account": "a-3",
                    "password": "a-3",
                    "role": 5,
                })
            )
            session.add(
                User(**{
                    "sid": "008",
                    "name": "export",
                    "account": "a-4",
                    "password": "a-4",
                    "role": 6,
                })
            )

            await session.commit()
