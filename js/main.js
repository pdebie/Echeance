/**
 * my date to string
 * @param {*} _adate 
 * @returns date en string locale
 */
function mydtos(_adate) {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return _adate.toLocaleDateString(undefined, options);
}

/** ajouteEcheance : ajoute une échéance
 * 
 * @param {*} _dateDu 
 * @param {*} _couvreStart 
 * @param {*} _couvreEnd 
 * @param {*} _echeances 
 */
function ajouteEcheance(_dateDu, _couvreStart, _couvreEnd, _echuechoir) {
  var uneEcheance = {};
  uneEcheance.du = new Date(_dateDu);
  uneEcheance.couvre = {};
  uneEcheance.couvre.start = new Date(_couvreStart);
  uneEcheance.couvre.end = new Date(_couvreEnd);
  _echuechoir.push(uneEcheance);
}

/** calculEcheance : toutes les échéances
 * 
 */
function calculEcheance(_start, _end, _quantieme, _echeances) {  
  /* Préparation première échéance échue  */
  var dateDu = new Date(_start);
  dateDu.setDate(_quantieme);

  console.log("dateDu", mydtos(dateDu));
  console.log("Start", mydtos(_start), " End", mydtos(_end));
  var startDay = _start.getDate();
  
  console.log("startDay, quantieme", startDay, _quantieme);
  if (startDay > _quantieme) {
    console.log("Après");
    dateDu.setMonth(dateDu.getMonth() + 1);
  }
  else {
    console.log("Avant");
  }
  var c_start = new Date(_start);
  var c_end = new Date(dateDu);
  ajouteEcheance(dateDu, c_start, c_end, _echeances.echu);

  /** échéances suivantes */
  var parcoursFini = false;
  while (!parcoursFini) {
    dateDu.setMonth(dateDu.getMonth() + 1);
    c_start = new Date(c_end);
    c_start.setDate(c_start.getDate() + 1);
    c_end.setMonth(c_end.getMonth() + 1);
    if (dateDu < _end) {
      ajouteEcheance(dateDu, c_start, c_end, _echeances.echu);
    }
    else
      parcoursFini = true;
  }
  
  console.log("A échoir");
  /* Préparation première échéance à échoir  */
  var dateDu = new Date(_start);
  console.log("dateDu", mydtos(dateDu));
  console.log("Start", mydtos(_start), " End", mydtos(_end));
  var startDay = _start.getDate();
  
  console.log("startDay, quantieme", startDay, _quantieme);
  if (startDay > _quantieme) {
    console.log("Après");
    var c_end = new Date(_start);
    c_end.setDate(_quantieme - 1);
    c_end.setMonth(c_end.getMonth() + 1);
  }
  else {
    console.log("Avant");
    var c_end = new Date(_start);
    c_end.setDate(_quantieme - 1);
  }
  var c_start = new Date(_start);
  
  ajouteEcheance(dateDu, c_start, c_end, _echeances.echoir);

  /** échéances suivantes */
  var parcoursFini = false;
  while (!parcoursFini) {
    dateDu = new Date(c_end)
    dateDu.setDate(dateDu.getDate()+1);
    c_start = new Date(c_end);
    c_start.setDate(c_start.getDate() + 1);
    c_end.setMonth(c_end.getMonth() + 1);
    if (dateDu < _end) {
      ajouteEcheance(dateDu, c_start, c_end, _echeances.echoir);
    }
    else
      parcoursFini = true;
  }

}

/** Echeancier fonction principale
 * 
 */
function echeancier(data) {
  var echEchu = document.getElementById('tableEchu');
  var echEchoir = document.getElementById('tableEchoir');
  
  var quantieme = document.getElementById("quantieme").value;
  var start = document.getElementById("start").valueAsDate;
  var end = document.getElementById("end").valueAsDate;
  var periode = document.getElementById("periode").value;

  console.log("---");
  console.log("Start", mydtos(start), " End", mydtos(end));

  var echeances = {
    echu: [],
    echoir: []
  }

  calculEcheance(start, end, quantieme, echeances);

  var body = document.getElementById('bodyEchu');
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  while (body.rows.length > 1) {
    body.deleteRow(1);
  }

  var body = document.getElementById('bodyEchoir');
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  /* Restitution des échéances  */
  echeances.echu.forEach(function(item, index, array) {
    var nouvelleLigne = echEchu.insertRow();
    var nouvelleCelluleDu = nouvelleLigne.insertCell();
    var nouveauDu = document.createTextNode(mydtos(item.du));
    nouvelleCelluleDu.appendChild(nouveauDu);
    var nouvelleCelluleCouvre = nouvelleLigne.insertCell();
    var nouveauCouvre = document.createTextNode(mydtos(item.couvre.start) + ' au ' + mydtos(item.couvre.end));
    nouvelleCelluleCouvre.appendChild(nouveauCouvre);
  });

  echeances.echoir.forEach(function(item, index, array) {
    var nouvelleLigne = echEchoir.insertRow();
    var nouvelleCelluleDu = nouvelleLigne.insertCell();
    var nouveauDu = document.createTextNode(mydtos(item.du));
    nouvelleCelluleDu.appendChild(nouveauDu);
    var nouvelleCelluleCouvre = nouvelleLigne.insertCell();
    var nouveauCouvre = document.createTextNode(mydtos(item.couvre.start) + ' au ' + mydtos(item.couvre.end));
    nouvelleCelluleCouvre.appendChild(nouveauCouvre);
  });

}
