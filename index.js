"use strict";
const https = require("https");
const httpcodes = require("./codes.json");
const default_animes = require("./default.json");
const base_animes = require("./animes.json");
const mopack = require("./package.json");

/*######################################################################################
#
# Por que fiz a linguagem em inglês?
# R: Pois eu gosto deste idioma e quis seguir o padrão como quase todos os outros devs.
#
# Esse código pode ser copiado para criar algo diferente, novo, superior ou etc?
# R: É claro! Mas você >PRECISA< manter o copyright, leia mais da licença abaixo.
#
# Por que este código parece igual ao seu outro da NASA?
# R: Por que eu quis fazer algo confortável para quem veio de outros projetos meus.
# R: Ou seja, quis manter o mesmo formato para facilitar, e vou continuar fazendo isso.
#
########################################################################################
#
#   MIT License
#
#   Copyright (c) 2022 KillovSky - Lucas R.
#
#   Permission is hereby granted, free of charge, to any person obtaining a copy
#   of this software and associated documentation files (the "Software"), to deal
#   in the Software without restriction, including without limitation the rights
#   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#   copies of the Software, and to permit persons to whom the Software is
#   furnished to do so, subject to the following conditions:
#
#   The above copyright notice and this permission notice shall be included in all
#   copies or substantial portions of the Software.
#
#   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#   SOFTWARE.
#
######################################################################################*/

/* Cria a exports para atuar como função */
function getAnimes() {

    /* Faz uma promise com a função para funcionar perfeitamente */
    return new Promise(function(resolve) {

        /* Cria a object de return em casos de erros, não afetando o usuário mas permitindo que ele saiba quando der erro */
        let anifail = base_animes[Math.floor(Math.random() * base_animes.length)];
        let pagenumber = (Math.floor(Math.random() * 22050)) + 1;

        /* Opções de acesso */
        const options = {
            hostname: "myanimelist.net",
            method: "GET",
            path: `/topanime.php?limit=${pagenumber}`
        };

        /* Try - Catch para caso dê um erro pior */
        try {

            /* Let para obter a chunk da requisição */
            let data = "";

            /* Faz a requisição */
            const req = https.get(options, function(res) {

                /* Recebe a chunk */
                res.on("data", function(chunk) {
                    data += chunk;
                });

                /* Em caso de falhas */
                req.on("error", function(err) {
                    return resolve(anifail);
                });

                /* Finaliza pois o resultado foi completamente recebido */
                res.on("end", function() {

                    /* Extrai as informações do HTML usando regex */
                    let body = data.match(/hoverinfo_trigger.*id/gi);
                    /* Por que não usou cheerio? Por que este módulo visa ser totalmente livre do uso de módulos externos */

                    /* Edita as informações extraídas a ponto de poder editar com regex */
                    body = body.map(anm => anm.replace(/.*http/gi, "http").replace(/".*/gi, ""));
                    body = body.filter(anm => anm.includes('anime') && !anm.includes('/video'));
                    body = [...new Set(body)];
                    /* Nesse ponto já adquiriu todos os 50 animes da página */

                    /* Extrai somente as linhas com contagem de tweets */
                    var Choice_Anime = "";
                    if (typeof body !== 'object') {
                        Choice_Anime = anifail;
                    } else {
                        Choice_Anime = body[Math.floor(Math.random() * body.length)];
                    }

                    return resolve(Choice_Anime);
                });
            });

            /* Em caso de falhas 2x */
            req.on("error", function(err) {
                return resolve(anifail);
            });

            /* Finaliza a requisição */
            req.end();

            /* Caso der erro em alguma coisa, não afeta o resultado e cai no catch abaixo */
        } catch (error) {
            resolve(anifail);
        }
    });
}

/* Cria a exports para atuar como função */
exports.get = function(
    aname = ""
) {

    /* Faz uma promise com a função para funcionar perfeitamente */
    return new Promise(function (resolve) {

        /* Cria a object de return em casos de erros, não afetando o usuário mas permitindo que ele saiba quando der erro */
        let response = default_animes[Math.floor(Math.random() * default_animes.length)];

        /* Caso for um teste */
        if (aname == "TESTING_USAGE") {
            return resolve(response);
        }

        /* Adquire o Anime */
        getAnimes().then(function (data) {

            /* Faz a URL padrão */
            const Anime_URL = new URL(data);

            /* Opções de acesso */
            const opts = {
                hostname: Anime_URL.hostname,
                method: "GET",
                path: Anime_URL.pathname
            };

            /* Try - Catch para caso dê um erro pior */
            try {

                /* Let para obter a chunk da requisição */
                let down = "";

                /* Faz a requisição */
                const adq = https.get(opts, function(red) {

                    /* Edita a object padrão de casos de erro */
                    response.code = red.statusCode;
                    response.explain = httpcodes[red.statusCode];
                    response.headers = red.headers;

                    /* Recebe a chunk */
                    red.on("data", function(chunk) {
                        down += chunk;
                    });

                    /* Em caso de falhas */
                    adq.on("error", function(err) {
                        response.error = true;
                        response.code = err.code;
                        response.error_msg = err.message;
                        return resolve(response);
                    });

                    /* Finaliza pois o resultado foi completamente recebido */
                    red.on("end", function() {

                        /* Cria uma Object para armazenar os dados */
                        let Anime_OBJ = {};

                        /* Link MAL */
                        Anime_OBJ.url = Anime_URL.href || false;

                        /* Try Catch para casos graves */
                        try {

                            /* Capa */
                            var Temp_IMG = down.match(/data-src=.*alt="/gi) || [];
                            Temp_IMG = Temp_IMG.map(img => img.replace("data-src=\"", "").replace("\" alt=\"", ""));
                            Temp_IMG = Temp_IMG.filter(img => !img.includes(" ") && img.startsWith("https://cdn.myanimelist.net/images/anime/"));
                            Anime_OBJ.image = Temp_IMG[0] || false;

                            /* Nome */
                            var Temp_Name = down.match(/class="title-name h1_bold_none.*<\/strong>/gi) || [];
                            Temp_Name = Temp_Name.map(nm => nm.replace("class=\"title-name h1_bold_none\"><strong>", "").replace("</strong>", ""));
                            Anime_OBJ.title = Temp_Name[0] || false;

                            /* Nome Sinônimo */
                            var Temp_Synonyms = down.match(/Synonyms:.*/gi) || [];
                            Temp_Synonyms = Temp_Synonyms.map(syn => syn.replace("Synonyms:</span> ", ""));
                            Anime_OBJ.title_synonyms = Temp_Synonyms[0] || false;

                            /* Nome Japonês */
                            var Temp_Japanese = down.match(/Japanese:.*/gi) || [];
                            Temp_Japanese = Temp_Japanese.map(syn => syn.replace("Japanese:</span> ", ""));
                            Anime_OBJ.title_japanese = Temp_Japanese[0] || false;

                            /* Nome Francês */
                            var Temp_French = down.match(/French:.*/gi) || [];
                            Temp_French = Temp_French.map(syn => syn.replace("French:</span> ", ""));
                            Anime_OBJ.title_french = Temp_French[0] || false;

                            /* Nome Inglês */
                            var Temp_English = down.match(/English:.*/gi) || [];
                            Temp_English = Temp_English.map(syn => syn.replace("English:</span> ", ""));
                            Anime_OBJ.title_english = Temp_English[0] || false;
                            if (Anime_OBJ.title_english === "Link Click") {
                                Anime_OBJ.title_english = Anime_OBJ.title;
                            }

                            /* Tipo */
                            var Temp_Type = down.match(/type"><a href=.*<\/a>/gim) || [];
                            Temp_Type = Temp_Type.map(type => type.replace("type\"><a href=\"", "").replace(/<\/a.*$/gi, ""));
                            Temp_Type = Temp_Type[0] || false;
                            Anime_OBJ.sort = {};
                            if (Temp_Type === false) {
                                Anime_OBJ.sort.url = false;
                                Anime_OBJ.sort.type = false;
                            } else {
                                Anime_OBJ.sort.url = Temp_Type.split("\">")[0];
                                Anime_OBJ.sort.type = Temp_Type.split("\">")[1];
                            }

                            /* Episódios */
                            var Temp_EP = down.match(/id="curEps".*span/gi) || [];
                            Temp_EP = Temp_EP.map(ep => ep.replace("id=\"curEps\">", "").replace("</span", ""));
                            Temp_EP = Temp_EP.filter(ep => !isNaN(ep));
                            Anime_OBJ.episodes = Temp_EP[0] || false;

                            /* My List */
                            var Temp_List = down.match(/data-raw=.*' data-ga/gi) || [];
                            Temp_List = Temp_List.map(list => list.replace("data-raw='", "").replace("' data-ga", ""));
                            Temp_List = Temp_List.filter(list => list.startsWith('{') && list.endsWith('}'));
                            try {
                                Anime_OBJ.list = JSON.parse(Temp_List[0]);
                            } catch (error) {
                                Anime_OBJ.list = false;
                            }

                            /* Status */
                            var Temp_Status = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Status = Temp_Status.match(/Status:.*<\/div/gi) || [];
                            Temp_Status = Temp_Status.filter(sts => sts.includes('span'));
                            Temp_Status = Temp_Status.map(sts => sts.replace("Status:</span>  ", "").replace("  </div", ""));
                            Anime_OBJ.status = Temp_Status[0] || false;

                            /* Duração */
                            var Temp_Timer = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Timer = Temp_Timer.match(/Duration:.*<\/div/gi) || [];
                            Temp_Timer = Temp_Timer.filter(sts => sts.includes('span'));
                            Temp_Timer = Temp_Timer.map(sts => sts.replace("Duration:</span>  ", "").replace("  </div", ""));
                            Anime_OBJ.duration = Temp_Timer[0] || false;

                            /* Score */
                            var Temp_Score = down.match(/score-label.*span/gi) || [];
                            const Score_Regex = /[0-9]+\|[0-9]+/gi;
                            Temp_Score = Temp_Score.map(scr => scr.replace(/score-label score-[0-9]+\">/gi, "").replace(/<\/span.*">/gi, "|").replace("</span", ""));
                            Temp_Score = Temp_Score.filter(scr => Score_Regex.test(scr));
                            Temp_Score = Temp_Score[0] || false;
                            Anime_OBJ.score = {};
                            if (Temp_Score == false) {
                                Anime_OBJ.score.votes = false;
                                Anime_OBJ.score.value = false;
                            } else {
                                Temp_Score = Temp_Score.split('|');
                                Anime_OBJ.score.votes = Temp_Score[1];
                                Anime_OBJ.score.value = Temp_Score[0];
                            }

                            /* Rank */
                            var Temp_Rank = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Rank = Temp_Rank.match(/Ranked:.*<sup/gi) || [];
                            Temp_Rank = Temp_Rank.filter(sts => sts.includes('span'));
                            Temp_Rank = Temp_Rank.map(sts => sts.replace(/.*span.*  #/gi, "").replace("<sup", ""));
                            Anime_OBJ.rank = Temp_Rank[0] || false;

                            /* Popularidade */
                            var Temp_Popu = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Popu = Temp_Popu.match(/Popularity:.*<\/div/gi) || [];
                            Temp_Popu = Temp_Popu.filter(sts => sts.includes('span'));
                            Temp_Popu = Temp_Popu.map(sts => sts.replace(/Popularity:<\/span>.*#/gi, "").replace("</div", ""));
                            Anime_OBJ.popularity = Temp_Popu[0] || false;

                            /* Membros */
                            var Temp_Memb = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Memb = Temp_Memb.match(/Members:.*<\/div/gi) || [];
                            Temp_Memb = Temp_Memb.filter(sts => sts.includes('span'));
                            Temp_Memb = Temp_Memb.map(sts => sts.replace(/Members:<\/span>    /gi, "").replace("</div", ""));
                            Anime_OBJ.members = Temp_Memb[0] || false;

                            /* Favoritos */
                            var Temp_Fav = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Fav = Temp_Fav.match(/Favorites:.*<\/div/gi) || [];
                            Temp_Fav = Temp_Fav.filter(sts => sts.includes('span'));
                            Temp_Fav = Temp_Fav.map(sts => sts.replace(/Favorites:<\/span>  /gi, "").replace("</div", ""));
                            Anime_OBJ.favorites = Temp_Fav[0] || false;

                            /* Classificação de Idade */
                            var Temp_Class = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Class = Temp_Class.match(/Rating:.*<\/div/gi) || [];
                            Temp_Class = Temp_Class.filter(sts => sts.includes('span'));
                            Temp_Class = Temp_Class.map(sts => sts.replace("Rating:</span>  ", "").replace("  </div", "").replace("amp;", ""));
                            Anime_OBJ.rating = Temp_Class[0] || false;

                            /* Links externos */
                            var Temp_Ext = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Ext = Temp_Ext.match(/class="pb16">.*<\/div/gi) || [];
                            Temp_Ext = Temp_Ext.join('\n');
                            Temp_Ext = Temp_Ext.replace(/<\/a>, </gi, '\n').replace(/" target="_blank">/gi, '|').replace(/class="pb16"><a href="/gi, '').replace(/a href="/gi, "").replace(/<\/a><\/div/gi, "").replace(/" target/gi, "\n");
                            Temp_Ext = Temp_Ext.match(/http.*\n/gi) || [];
                            Anime_OBJ.external = [];
                            if (Temp_Ext.length == 0) {
                                Anime_OBJ.external = false;
                            } else {
                                for (let extr of Temp_Ext) {
                                    const Exter_URL = extr.split("|");
                                    const URL_Ext = new URL(Exter_URL[0]);
                                    Anime_OBJ.external.push({
                                        "name": (Exter_URL[1] || URL_Ext.host).replace('\n', ''),
                                        "url": Exter_URL[0].replace('\n', '')
                                    });
                                }
                            }

                            /* Personagens */
                            var Temp_Char = down.replace(/\n/gi, '').replace(/<\/table>/gi, "</table>\n");
                            Temp_Char = Temp_Char.match(/characters_voice_actors.*<\/table>/gi) || [];
                            Temp_Char = Temp_Char.map(chr => chr.replace(/characters_voice_actors"><a href="/gi, "").replace("\">", "|").replace(/<\/a>.*<a href="/gi, "|").replace(/">                      <img.*alt="/gi, "|").replace(/" width.*src="/gi, "|").replace(/" data-srcset="/gi, "|").replace(/ 1x, /gi, "|").replace(/ 2x".*/gi, ""));
                            Anime_OBJ.characters = [];
                            if (Temp_Char.length == 0) {
                                Anime_OBJ.characters = false;
                            } else {
                                for (let chr of Temp_Char) {
                                    const Char_URL = chr.split("|");
                                    const Char_Voz = Char_URL.filter(chr => chr.includes('cdn.myanimelist.net'));
                                    Anime_OBJ.characters.push({
                                        "voice": {
                                            "name": Char_URL[3].replace(/<\/a>.*/gi, ""),
                                            "url": Char_URL[2],
                                            "images": Char_Voz
                                        },
                                        "name": Char_URL[1],
                                        "url": Char_URL[0]
                                    });
                                }
                            }

                            /* OSTs */
                            var Temp_Ost = down.replace(/\n/gi, '').replace(/<\/td>/gi, "<STOPHERE>\n");
                            Temp_Ost = Temp_Ost.match(/theme-song-title.*<STOPHERE>/gi) || [];
                            Temp_Ost = Temp_Ost.map(ost => ost.replace(/theme-song-title">"/gi, "").replace(/<\/span>.*theme-song-artist">( ?)/gi, "|").replace(/<\/span>.*theme-song-episode">(\(?)/gi, "|"));
                            Temp_Ost = Temp_Ost.join('\n');
                            Temp_Ost = Temp_Ost.replace(/" value="/gi, "\n").replace(/\)<\/span>.*\n/gi, "|").replace(/" \/>.*\n/gi, "|").replace(/\|" \/>.*/gi, "").replace(/\|\|/gi, "[^]");
                            Temp_Ost = Temp_Ost.split("[^]") || [];
                            Anime_OBJ.ost = [];
                            if (Temp_Ost.length == 0) {
                                Anime_OBJ.ost = false;
                            } else {
                                for (let ost of Temp_Ost) {
                                    const OST_anime = ost.split("|").map(ostk => ostk.replace(/"/gi, "").replace(/by /gi, "").replace(/&#039;/gi, "").replace(/eps /gi, "").replace(/"/gi, ""));
                                    const Sounds = OST_anime.filter(stk => stk.includes('http'));
                                    const Obj_Sounds = {
                                        "hear": {
                                            "spotify": ((Sounds.filter(sd => sd.includes("spotify")))[0] || false),
                                            "apple": ((Sounds.filter(sd => sd.includes("apple")))[0] || false),
                                            "amazon": ((Sounds.filter(sd => sd.includes("amazon")))[0] || false),
                                            "youtube": ((Sounds.filter(sd => sd.includes("youtube")))[0] || false)
                                        },
                                        "name": OST_anime[0],
                                        "by": OST_anime[1],
                                        "ep": OST_anime[2]
                                    };
                                    const Another_Sites = ((Sounds.filter(sd => !sd.includes("youtube") && !sd.includes("amazon") && !sd.includes("apple") && !sd.includes("spotify"))) || false);
                                    if (Another_Sites.length == 0) {
                                        Obj_Sounds.hear.other = false;
                                    } else {
                                        Obj_Sounds.hear.other = Another_Sites;
                                    }
                                    Anime_OBJ.ost.push(Obj_Sounds);
                                }
                            }

                            /* Reviews, pode não conter a review toda devido a grande uso de breakspace */
                            var Temp_Rev = down.replace(/\n/gi, "").replace(/(?:\r\n|\r|\n)/g, "<br>").replace(/<br \/><br><br \/><br>/gi, "<br>").replace(/class="update_at"/gi, "\nclass=\"update_at\"").replace(/<div class="rating mt20 mb20 js-hidden"/gi, "\n<div class=\"rating mt20 mb20 js-hidden\"").replace(/          /gi, "").replace(/      /gi, "");
                            Temp_Rev = Temp_Rev.match(/class="update_at".*<br>/gi) || [];
                            Temp_Rev = Temp_Rev.map(rev => rev.replace(/class="update_at">/gi, "").replace(/<\/div>.*<a href="/gi, "|").replace(/<\/div>.*href="/gi, "|").replace(/" class=".*anime-reviewer">/gi, "|").replace(/<\/a>/gi, "").replace(/"><i class="fas fa.*class="text">/gi, "|").replace(/<span class="js-visible".*style="display: none;">/gi, "").replace(/<br>/gi, "\n").replace(/&#039;/gi, "").replace(/"><i class.*class="text">/gi, "|"));
                            Anime_OBJ.reviews = [];
                            if (Temp_Rev.length == 0) {
                                Anime_OBJ.reviews = false;
                            } else {
                                for (let revs of Temp_Rev) {
                                    const Review_Info = revs.split("|");
                                    Anime_OBJ.reviews.push({
                                        "name": Review_Info[2],
                                        "date": Review_Info[0],
                                        "url": Review_Info[1],
                                        "at": Review_Info[3],
                                        "review": Review_Info[4]
                                    });
                                }
                            }

                            /* Relacionados */
                            var Temp_Rela = down.match(/anime_detail_related_anime.*>/gi) || [];
                            Temp_Rela = Temp_Rela.join('\n');
                            Temp_Rela = Temp_Rela.replace(/href/gi, "\n").replace(/=\"/gi, "").replace(/<\/a>.*<a /gi, "").replace(/">/gi, "|").replace(/" stylefont-weight: normal;/gi, "").replace(/<\/a>.*/gi, "");
                            Temp_Rela = Temp_Rela.split('\n') || [];
                            Temp_Rela = Temp_Rela.filter(rel => rel.includes('/anime') || rel.includes('/manga'));
                            Temp_Rela = [...new Set(Temp_Rela)];
                            Anime_OBJ.related = [];
                            if (Temp_Rela.length == 0) {
                                Anime_OBJ.related = false;
                            } else {
                                for (let relt of Temp_Rela) {
                                    const Premiere_Data = relt.split("|");
                                    Anime_OBJ.related.push({
                                        "name": Premiere_Data[1],
                                        "url": "https://myanimelist.net" + Premiere_Data[0]
                                    });
                                }
                            }

                            /* URL's do MAL */
                            var Temp_URLs = down.match(/<li><a href="https:\/\/myanimelist.*>/gi) || [];
                            Temp_URLs = Temp_URLs.filter(mal => mal.includes(Anime_URL.href));
                            Temp_URLs = Temp_URLs.map(mal => mal.replace(/<li><a href="/gi, '').replace(/">/gi, '|').replace(/<\/a>/gi, '').replace(/\" class=\"horiznav_active/gi, ""));
                            Anime_OBJ.links = [];
                            if (Temp_URLs.length == 0) {
                                Anime_OBJ.links = false;
                            } else {
                                for (let lks of Temp_URLs) {
                                    const Premiere_Data = lks.split("|");
                                    Anime_OBJ.links.push({
                                        "name": Premiere_Data[1],
                                        "url": Premiere_Data[0]
                                    });
                                }
                            }

                            /* Descrição do anime */
                            var Temp_Desc = down.match(/property="og:description".*>/gi) || [];
                            Temp_Desc = Temp_Desc.map(desc => desc.replace("property=\"og:description\" content=\"", "").replace("\">", "").replace(/&quot;/gi, '').replace(/&#039;/gi, ""));
                            Anime_OBJ.description = Temp_Desc[0] || false;

                            /* Streaming Plataforms */
                            var Temp_Stream = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Stream = Temp_Stream.match(/<a.*class="broadcast/gi) || [];
                            Temp_Stream = Temp_Stream.map(str => str.replace(/<a href="/gi, "").replace(/" title="/gi, "|").replace(/" class.*/gi, ""));
                            Anime_OBJ.stream = [];
                            if (Temp_Stream.length == 0) {
                                Anime_OBJ.stream = false;
                            } else {
                                for (let stre of Temp_Stream) {
                                    const Stream_Data = stre.split("|");
                                    Anime_OBJ.stream.push({
                                        "name": Stream_Data[1],
                                        "url": Stream_Data[0]
                                    });
                                }
                            }

                            /* Fóruns */
                            var Temp_Forum = down.match(/\/forum\/\?.*<small>/gi) || [];
                            Temp_Forum = Temp_Forum.map(frm => frm.replace(/" class="ga-click".*-discussion">/gi, "|").replace(/<\/a> <small>/gi, ""));
                            Anime_OBJ.foruns = [];
                            if (Temp_Forum.length == 0) {
                                Anime_OBJ.foruns = false;
                            } else {
                                for (let frns of Temp_Forum) {
                                    const Foruns_Data = frns.split("|");
                                    Anime_OBJ.foruns.push({
                                        "name": Foruns_Data[1],
                                        "url": "https://myanimelist.net" + Foruns_Data[0]
                                    });
                                }
                            }

                            /* Recomendações */
                            var Temp_Reco = down.match(/.*link bg-center ga-click/gi) || [];
                            Temp_Reco = Temp_Reco.map(rec => rec.replace(/^.*title="/gi, "").replace(/"><a href="/gi, "|").replace(/" class=".*/gi, ""));
                            Anime_OBJ.recommendations = [];
                            if (Temp_Reco.length == 0) {
                                Anime_OBJ.recommendations = false;
                            } else {
                                for (let recs of Temp_Reco) {
                                    const Recom_Data = recs.split("|");
                                    Anime_OBJ.recommendations.push({
                                        "name": Recom_Data[0],
                                        "url": Recom_Data[1]
                                    });
                                }
                            }

                            /* Data de lançamento */
                            var Temp_Aired = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Aired = Temp_Aired.match(/Aired:.*<\/div/gi) || [];
                            Temp_Aired = Temp_Aired.filter(sts => sts.includes('span'));
                            Temp_Aired = Temp_Aired.map(sts => sts.replace("Aired:</span>  ", "").replace("  </div", ""));
                            Anime_OBJ.aired = Temp_Aired[0] || false;

                            /* Source */
                            var Temp_Source = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Source = Temp_Source.match(/Source:.*<\/div/gi) || [];
                            Temp_Source = Temp_Source.filter(sts => sts.includes('span'));
                            Temp_Source = Temp_Source.map(sts => sts.replace("Source:</span>  ", "").replace("  </div", ""));
                            Anime_OBJ.source = Temp_Source[0] || false;

                            /* Broadcast */
                            var Temp_Broad = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Broad = Temp_Broad.match(/Broadcast:.*<\/div/gi) || [];
                            Temp_Broad = Temp_Broad.filter(sts => sts.includes('span'));
                            Temp_Broad = Temp_Broad.map(sts => sts.replace("Broadcast:</span>    ", "").replace("      </div", ""));
                            Anime_OBJ.broadcast = Temp_Broad[0] || false;

                            /* Premiere */
                            var Temp_Premier = down.replace(/\n/gi, '').replace(/div/gi, 'div\n');
                            Temp_Premier = Temp_Premier.match(/Premiered:.*<\/div/gi) || [];
                            Temp_Premier = Temp_Premier.filter(sts => sts.includes('span'));
                            Temp_Premier = Temp_Premier.map(sts => sts.replace("Premiered:</span>  ", "").replace("  </div", ""));
                            Anime_OBJ.premier = [];
                            if (Temp_Premier.length == 0) {
                                Anime_OBJ.premier = false;
                            } else {
                                Temp_Premier = Temp_Premier.join('\n');
                                Temp_Premier = Temp_Premier.match(/http.*<\/a>/gi) || [];
                                Temp_Premier = Temp_Premier.map(prem => prem.replace("</a>", ""));
                                for (let prem of Temp_Premier) {
                                    const Premiere_Data = prem.split("\">") || [];
                                    Anime_OBJ.premier.push({
                                        "at": Premiere_Data[1],
                                        "url": Premiere_Data[0]
                                    });
                                }
                            }

                            /* Gêneros, Temas e Demografia, tudo em um pra não deixar o código gigante */
                            var Temp_Genre = down.match(/\/anime\/genre.*">/gim) || [];
                            Temp_Genre = Temp_Genre.join('\n');
                            Temp_Genre = Temp_Genre.replace(/<\/a>/gi, '\n');
                            Temp_Genre = Temp_Genre.split("\"") || [];
                            Temp_Genre = Temp_Genre.filter(g => g.includes("anime/genre"));
                            Temp_Genre = Temp_Genre.map(g => g.replace(/.*(\n?).*anime/gi, "anime"));
                            Temp_Genre = [...new Set(Temp_Genre)] || [];
                            Anime_OBJ.genres = [];
                            for (let genr of Temp_Genre) {
                                let Genr_Name = genr.split("/") || [];
                                Anime_OBJ.genres.push({
                                    "name": Genr_Name.pop(),
                                    "url": "https://myanimelist.net/" + genr
                                });
                            }

                            /* Produtores, Licenciantes e Estúdios, tudo em um pra não deixar o código gigante */
                            var Temp_Producer = down.match(/\/anime\/producer.*">/gim) || [];
                            Temp_Producer = Temp_Producer.join('\n');
                            Temp_Producer = Temp_Producer.replace(/<\/a>/gi, '\n');
                            Temp_Producer = Temp_Producer.split("\"") || [];
                            Temp_Producer = Temp_Producer.filter(tpc => tpc.includes("anime/producer"));
                            Temp_Producer = Temp_Producer.map(tpc => tpc.replace(/.*(\n?).*anime/gi, "anime"));
                            Temp_Producer = [...new Set(Temp_Producer)] || [];
                            Anime_OBJ.producers = [];
                            for (let prod of Temp_Producer) {
                                let Prod_Name = prod.split("/") || [];
                                Anime_OBJ.producers.push({
                                    "name": Prod_Name.pop(),
                                    "url": "https://myanimelist.net/" + prod
                                });
                            }
                        } catch (error) {
							response = default_animes[Math.floor(Math.random() * default_animes.length)];
                            response.error = true;
                            response.code = error.code;
                            response.error_msg = error.message;
                            return resolve(response);
                        }

                        /* Finaliza a resposta do MAL */
                        response.MAL = Anime_OBJ;

                        /* Insere a data do dia */
                        let today = new Date();
                        response.date = today.toLocaleString();

                        /* Finaliza o request e retorna o JSON */
                        return resolve(response);
                    });
                });

                /* Em caso de falhas 2x */
                adq.on("error", function(err) {
                    response.error = true;
                    response.code = err.code;
                    response.error_msg = err.message;
                    return resolve(response);
                });

                /* Finaliza a requisição */
                adq.end();

                /* Caso der erro em alguma coisa, não afeta o resultado e cai no catch abaixo */
            } catch (error) {
                response.error = true;
                response.code = error.code;
                response.error_msg = error.message;
                return resolve(response);
            }
        }).catch(function (error) {
            response.error = true;
            response.code = error.code;
            response.error_msg = error.message;
            return resolve(response);
        });
    });
};

/* Retorna os animes padrões */
exports.animes = () => base_animes;

/* Retorna um URL de anime aleatório do MAL */
exports.onlyurl = () => getAnimes();

/* Retorna o JSON da default */
exports.defaults = () => default_animes;

/* Retorna os códigos HTTP */
exports.http = () => httpcodes;

/* Retorna a package.json */
exports.packages = () => mopack;