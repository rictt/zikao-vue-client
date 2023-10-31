import { baseURL } from "../api/request";

export function decodeCorrect(correct, questionId, index) {
  let o = correct;
  let i = index + questionId;
  o = n(o);
  let a = "";
  let c = 0;
  for (let s = i.length; c < o.length; c++) {
    const u = c % s;
    a += String.fromCharCode(o.charCodeAt(c) ^ i.charCodeAt(u))
  }
  return n(a)
}

export function n(e) {
  var t, r, n, o, i, s, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    c = 0,
    u = 0,
    g = [];
  if (!e) return e;
  e += "";
  do {
    t = (s = a.indexOf(e.charAt(c++)) << 18 | a.indexOf(e.charAt(c++)) << 12 | (o = a.indexOf(e.charAt(c++))) << 6 | (i = a.indexOf(e.charAt(c++)))) >> 16 & 255, r = s >> 8 & 255, n = 255 & s, g[u++] = 64 == o ? String.fromCharCode(t) : 64 == i ? String.fromCharCode(t, r) : String.fromCharCode(t, r, n)
  } while (c < e.length);
  return g.join("")
}

export function rand_ABCD_arr(e, t) {
  // e是opt的abcd选项， t是correct
  // const r = e.length;
  // const n = [];
  // let o = 0;
  for (var r = e.length, n = new Array, o = 0; o < r; o++) {
    n[o] = o
  };
  // n = [0, 1, 2, 3, 4]
  var i = new Array;
  for (o = 0; o < r; o++) {
    i[o] = n.splice(Math.floor(Math.random() * n.length), 1);
  }
  for (o = 0; o < r; o++)
    if (i[o] == t - 1) {
      t = o + 1;
      break
    } var s = new Array;
  for (o = 0; o < r; o++) s[o] = e[i[o]];
  return {
    opt: s,
    correct: t
  }
}

export function replaceImgUrl(str) {
  if (str && str.indexOf && str.indexOf('//img.chen666.top') !== -1) {
    const before = 'https://img.chen666.top/cnd/'
    // const host = import.meta.env.MODE === 'production' ? 'http://119.91.143.19/api/img?url=' : 'http://localhost:3000/img?url='
    const host = ''
    const after = host + 'https:/img.chen666.top/cnb/'
    return str.replace(new RegExp(before, 'g'), after)
  }
  return str
}

export function questionChange(e) {
  var t = ["", "A", "B", "C", "D", "E", "F", "G"],
    n = [],
    // o = wx.getStorageSync(wx.getStorageSync("question_category").id + "_user_question_collect"),
    o = [],
    // i = wx.getStorageSync("i");
    i = 'ACE';
  o || (o = [])
  for (var s = 0; s < e.length; s++) {
    var a = !1;
    // a = wx.config.is_question_record ? !!e[s].is_collect : !!o.includes(e[s].id);
    a = false ? !!e[s].is_collect : !!o.includes(e[s].id);
    // 1 == e[s].e && (e[s].correct = r(e[s].correct, e[s].id, i))
    let originCorrect = e[s].correct
    if (1 == e[s].e) {
      e[s].correct = decodeCorrect(e[s].correct, e[s].id, i)
    }
    n[s] = {
      originCorrect,
      objectId: s + 1,
      question_id: e[s].id,
      title: replaceImgUrl(e[s].title.replace(/<(?![A-z/])/, "&lt;")),
      answer: t[e[s].correct] ? t[e[s].correct] : "",
      answerArr: [t[e[s].correct]],
      choseList: [],
      picUrl: "",
      type: 0,
      collect: a,
      analyse: replaceImgUrl(e[s].analyse.replace(/<(?![A-z/])/, "&lt;")),
      score: e[s].score,
      chapter_id: e[s].chapter_id,
      note: e[s].note
    };
    e[s].opt = e[s].opt.replace(/<(?![A-z/])/, "&lt;");
    switch (e[s].type) {
      case "1":
        var c = e[s].opt.split("#"),
          u = {};
        if (e[s].is_rand) {
          u = rand_ABCD_arr(c, e[s].correct);
          n[s].answer = t[u.correct]
          n[s].answerArr = [t[u.correct]]
        } else {
          u.opt = c;
          n[s].answer = t[e[s].correct]
          n[s].answerArr = [t[e[s].correct]]
        }
        // e[s].is_rand ?
        //   (u = rand_ABCD_arr(c, e[s].correct), n[s].answer = t[u.correct], n[s].answerArr = [t[u.correct]])
        //   : (u.opt = c, n[s].answer = t[e[s].correct], n[s].answerArr = [t[e[s].correct]]);
        for (var g = 0; g < u.opt.length; g++) n[s].choseList[g] = {
          item: replaceImgUrl(u.opt[g])
        };
        n[s].picUrl = e[s].img;
        n[s].type = 1;
        break;
      case "2":
        n[s].choseList = [{
          item: "对"
        }, {
          item: "错"
        }], n[s].picUrl = e[s].img, n[s].type = 3;
        break;
      case "3":
        c = e[s].opt.split("#");
        for (var d = 0; d < c.length; d++) n[s].choseList[d] = {
          item: c[d]
        };
        var l = e[s].correct + "";
        l = l.split("");
        for (var f = 0; f < l.length; f++) n[s].answerArr[f] = t[l[f]], n[s].answer += t[l[f]];
        n[s].picUrl = e[s].img;
        // n[s].type = "2";
        n[s].type = "3";
        break;
      case "4":
        n[s].choseList[0] = {
          item: e[s].opt ? e[s].opt : "查看答案"
        }
        n[s].answer = "A"
        n[s].type = 4
    }
  }
  return n
}