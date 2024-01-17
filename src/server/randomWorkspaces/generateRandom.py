from wonderwords import RandomWord
with open('randomWorkspaces.txt', 'w') as f:
    for i in range(2000):
        r = RandomWord()

        adjective = r.word(include_parts_of_speech=["adjectives"])
        noun = r.word(include_parts_of_speech=["nouns"]).capitalize()
        f.write(adjective + " " + noun + "s\n")