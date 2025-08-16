from gtts import gTTS

tts_tasks = [
    # Tales
    ("Сказка о бабочке", "butterfly-tale-ru.mp3"),
    ("Сказка о облаках", "clouds-tale-ru.mp3"),
    ("Сказка о друге", "friend-tale-ru.mp3"),
    ("Герой острова", "hero-tale-ru.mp3"),
    # Numbers
    ("Один", "one-ru.aac"),
    ("Два", "two-ru.aac"),
    ("Три", "three-ru.aac"),
    ("Четыре", "four-ru.aac"),
    ("Пять", "five-ru.aac"),
    ("Шесть", "six-ru.aac"),
    ("Семь", "seven-ru.aac"),
    ("Восемь", "eight-ru.aac"),
    ("Девять", "nine-ru.aac"),
    ("Десять", "ten-ru.aac"),
    # Letters (using numbers as placeholders, you can record real letter sounds if needed)
    ("А", "letter-a-ru.aac"),
    ("Б", "letter-b-ru.aac"),
    ("В", "letter-c-ru.aac"),
    ("Г", "letter-d-ru.aac"),
    ("Д", "letter-e-ru.aac"),
    ("Е", "letter-f-ru.aac"),
    ("Ё", "letter-g-ru.aac"),
    ("Ж", "letter-h-ru.aac"),
    ("З", "letter-i-ru.aac"),
    ("И", "letter-j-ru.aac"),
    ("Й", "letter-k-ru.aac"),
    ("К", "letter-l-ru.aac"),
    ("Л", "letter-m-ru.aac"),
    ("М", "letter-n-ru.aac"),
    ("Н", "letter-o-ru.aac"),
    ("О", "letter-p-ru.aac"),
    ("П", "letter-q-ru.aac"),
    ("Р", "letter-r-ru.aac"),
    ("С", "letter-s-ru.aac"),
    ("Т", "letter-t-ru.aac"),
    ("У", "letter-u-ru.aac"),
    ("Ф", "letter-v-ru.aac"),
    ("Х", "letter-w-ru.aac"),
    ("Ц", "letter-x-ru.aac"),
    ("Ч", "letter-y-ru.aac"),
    ("Ш", "letter-z-ru.aac"),
    # Misc
    ("Посчитай рыбок", "counting-fish-ru.mp3"),
    ("Остров Нумерия", "island-numeriya-ru.mp3"),
    ("Поздравляем!", "congrats-ru.mp3"),
    ("Ежедневный подарок", "daily-gift-ru.mp3"),
    ("Колесо подарков", "gift-wheel-ru.mp3"),
    ("Поехали!", "lets-go-ru.mp3"),
    ("Навигация", "navigation-ru.mp3"),
    ("Профиль", "profile-ru.mp3"),
    ("Напоминание о сне", "sleep-reminder-ru.mp3"),
    ("Магазин", "store-ru.mp3"),
    ("Трекер", "tracker-ru.mp3"),
    ("Добро пожаловать в сказки", "welcome-tales-ru.mp3"),
    ("Куда полететь?", "where-to-fly-ru.mp3"),
    ("Аудио недоступно", "unavailable-ru.mp3"),
    ("Поздравляем, вы выиграли!", "congrats-you-won-ru.mp3"),
    ("Монеты", "coins-ru.mp3"),
]

for text, filename in tts_tasks:
    tts = gTTS(text=text, lang='ru')
    tts.save(filename)
    print(f"Saved: {filename}")

print("All done! Move the generated files to your assets/audios/ru/ directory.")