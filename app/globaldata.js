let curIndex = 0;
let password = '12345678';
let libraryTitle = [
    'Salon', 'Chambre', 'Salle à manger', 'Cuisine',
    'Salle de bain', 'Extérieur', 'Commercial', 'Porte Principale',
    'Nos Collections de PEINTURE', 'Nos Collections de PAPIER PEINT'
];
let libraryDesc = [
    '!Salon', '!Chambre', '!Salle à manger', '!Cuisine',
    '!Salle de bain', '!Extérieur', '!Commercial', '!Porte Principale',
    '!Nos Collections de PEINTURE', '!Nos Collections de PAPIER PEINT'
];

const setPassword = function(newPass) {
    password = newPass;
}

const getPassword = function() {
    return password;
}

const updateTitle = function(idx, value) {
    libraryTitle[idx] = value;
}

const getTitles = function() {
    return libraryTitle;
}

const updateDesc = function(idx, value) {
    libraryDesc[idx] = value;
}

const getDescs = function() {
    return libraryDesc;
}

module.exports = {curIndex, getPassword, setPassword, updateTitle, getTitles, updateDesc, getDescs};