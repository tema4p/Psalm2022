
const kafismaList: any = {
    'kafisma1':  {'kafisma': '1',  'ru': 'Кафизма 1',  'cs': 'Каfjсма пе1рваz, а7'},
    'kafisma2':  {'kafisma': '2',  'ru': 'Кафизма 2',  'cs': 'Каfjсма втора1z, в7'},
    'kafisma3':  {'kafisma': '3',  'ru': 'Кафизма 3',  'cs': 'Каfjсма тре1тіz, г7'},
    'kafisma4':  {'kafisma': '4',  'ru': 'Кафизма 4',  'cs': 'Каfjсма четве1ртаz, д7'},
    'kafisma5':  {'kafisma': '5',  'ru': 'Кафизма 5',  'cs': 'Каfjсма пz1таz, є7'},
    'kafisma6':  {'kafisma': '6',  'ru': 'Кафизма 6',  'cs': 'Каfjсма шеста1z, ѕ7'},
    'kafisma7':  {'kafisma': '7',  'ru': 'Кафизма 7',  'cs': 'Каfjсма седма1z, з7'},
    'kafisma8':  {'kafisma': '8',  'ru': 'Кафизма 8',  'cs': 'Каfjсма o3сма1z, и7'},
    'kafisma9':  {'kafisma': '9',  'ru': 'Кафизма 9',  'cs': 'Каfjсма девz1таz, f7'},
    'kafisma10': {'kafisma': '10', 'ru': 'Кафизма 10', 'cs': 'Каfjсма десz1таz, i7'},
    'kafisma11': {'kafisma': '11', 'ru': 'Кафизма 11', 'cs': 'Каfjсма перваzна1десzть, а7i'},
    'kafisma12': {'kafisma': '12', 'ru': 'Кафизма 12', 'cs': 'Каfjсма втораzна1десzть, в7i'},
    'kafisma13': {'kafisma': '13', 'ru': 'Кафизма 13', 'cs': 'Каfjсма третіzна1десzть, г7i'},
    'kafisma14': {'kafisma': '14', 'ru': 'Кафизма 14', 'cs': 'Каfjсма четвертаzна1десzть, д7i'},
    'kafisma15': {'kafisma': '15', 'ru': 'Кафизма 15', 'cs': 'Каfjсма пzтаzна1десzть, є7i'},
    'kafisma16': {'kafisma': '16', 'ru': 'Кафизма 16', 'cs': 'Каfjсма шестаzна1десzть, ѕ7i'},
    'kafisma17': {'kafisma': '17', 'ru': 'Кафизма 17', 'cs': 'Каfjсма седмаzна1десzть, з7i'},
    'kafisma18': {'kafisma': '18', 'ru': 'Кафизма 18', 'cs': 'Каfjсма o3смаzна1десzть, и7i'},
    'kafisma19': {'kafisma': '19', 'ru': 'Кафизма 19', 'cs': 'Каfjсма девzтаzна1десzть, f7i'},
    'kafisma20': {'kafisma': '20', 'ru': 'Кафизма 20', 'cs': 'Каfjсма двадесz1таz, к7'}
};

const otherList: any = {
    'ustav':   {'add': 'ustav',   'ru': 'О порядке келейного (домашнего) чтения псалтири', 'cs': 'Ўстaвъ ст7hхъ nтє1цъ'},
    'start':   {'add': 'start',   'ru': 'Молитвы перед началом чтения Псалтири', 'cs': 'Разyмно да бyдетъ, кaкw подобaетъ o3с0бь пёти pалти1рь'},
    'end':     {'add': 'end',     'ru': 'Молитвы по прочтении нескольких кафисм или всей Псалтири', 'cs': 'По совершeніи же нёколикихъ каfjсмъ, и3ли2 все1й pалти1ри'},
    'posled':  {'add': 'posled',  'ru': 'Последование по исходе души от тела', 'cs': 'Послёдованіе по и3сх0дэ души2 t тёла'},
    'pomannik':{'add': 'pomannik','ru': false, 'cs': 'Помsнникъ'},
    'info':    {'add': 'info',    'ru': 'О псалмопении', 'cs': false},
    '6p':      {'chin': '6p',     'ru': 'Шестопсалмие', 'cs': 'Шестопсалмие', 'forceRu': true},
    '12p':     {'chin': '12p',    'ru': 'Чин чтения 12-ти псалмов', 'cs': 'Чин чтения 12-ти псалмов', 'forceRu': true},
    'songs':   {'songs': 'songs', 'ru': 'Песни Священного Писания', 'cs': 'Пэ~сни свzще~ннагw писа~ніz.'}
};

export class Contents {
    public static getKafizmaList(): any {
        return kafismaList;
    }

    public static getOtherList(): any {
        return otherList;
    }

    public static getItem(id: string): any {
      return kafismaList['kafisma' + id];
    }
}
