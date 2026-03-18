"""
챌린지 시드 스크립트
Usage: python -m seed_challenges
"""

import asyncio
from src.models.database import AsyncSessionLocal, init_db
from src.models.challenge import Challenge
from sqlalchemy import select


CHALLENGES = [
    {
        "title": "3D Model Inspector",
        "description": (
            "우리 회사에서 새로 만든 3D Model Inspector 서비스!\n"
            "glTF 모델을 업로드하면 vertex 데이터를 추출해줍니다.\n"
            "cgltf_validate()도 호출하고, vertex 수도 4096개로 제한했으니 안전하겠죠?\n\n"
            "nc HOST 31337"
        ),
        "difficulty": "medium",
        "category": "Pwn",
        "points": 300,
        "flag": "FLAG{h34p_0v3rr34d_1n_cgl7f_4cc3ss0r_r34d_fl04t}",
        "hint": "cgltf_accessor_read_float()에서 buffer 범위 검사를 확인해보세요. accessor의 count와 buffer의 byteLength가 다르면?",
        "file_url": "/static/challenges/cgltf-oob-read/files.tar.gz",
        "is_active": True,
        "order": 10,
    },
]


async def seed():
    await init_db()

    async with AsyncSessionLocal() as session:
        for data in CHALLENGES:
            result = await session.execute(
                select(Challenge).where(Challenge.title == data["title"])
            )
            existing = result.scalar_one_or_none()

            if existing:
                for key, value in data.items():
                    setattr(existing, key, value)
                print(f"[*] Updated: {data['title']}")
            else:
                session.add(Challenge(**data))
                print(f"[+] Created: {data['title']}")

        await session.commit()
    print("[+] Seed complete")


if __name__ == "__main__":
    asyncio.run(seed())
