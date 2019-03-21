import React, { Component } from 'react';
import axios from 'axios';

class PainelEmocao extends Component {
    constructor(props) {
        super(props);

        this.data = props.data;
        // this.handleDescricao = this.handleDescricao.bind(this);
    }

    async handleDescricao (descricao) {
        const key = "9a1b21c339c1401e8c486ca264d333f5";
        console.log("handle");
        let responseIdioma = await axios({
            method: 'post',
            url: 'https://brazilsouth.api.cognitive.microsoft.com/text/analytics/v2.0/languages',
            headers : {
                'Ocp-Apim-Subscription-Key' : key,
            },
            data : {
                "documents" : [
                    {
                        "id" : "1",
                        "text" : descricao,
                    }
                ]
            },

        })
        responseIdioma = responseIdioma.data.documents[0].detectedLanguages;
        let responseFrases = await axios({
            method: 'post',
            url: 'https://brazilsouth.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases',
            headers : {
                'Ocp-Apim-Subscription-Key' : key,
            },
            data : {
                "documents" : [
                    {
                        "language" : responseIdioma.iso6391Name,
                        "id" : "1",
                        "text" : descricao, 
                    }
                ]
            },
        })
        responseFrases = responseFrases.data.documents[0].keyPhrases;

        let responseSentimento = await axios({
            method: 'post',
            url: 'https://brazilsouth.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
            headers : {
                'Ocp-Apim-Subscription-Key' : key,
            },
            data : {
                "documents": [
                    {
                        "language" : responseIdioma.iso6391Name,
                        "id" : "1",
                        "text" : descricao, 
                    }
                ]
            }
        })
        responseSentimento = responseSentimento.data.documents[0].score;
        
        console.log(responseIdioma, responseFrases, responseSentimento);
        return [responseIdioma, responseFrases, responseSentimento];
    }

    render () {
        return (
            <div className="row">
                {this.data.map( info => {
                    let infosDescricao = this.handleDescricao(info.userDescricao);
                    
                    console.log(infosDescricao);
                    return (
                        <div className="col-md-3" key={info.userNome}>
                            <div className="card mt-3">
                                <div className="card-title text-center">
                                    <b>Nome</b><br/> 
                                    <span className="badge badge-primary"><h6>{info.userNome}</h6> </span><br/>
                                    
                                </div>
                                <div className="card-body">
                                    Email <br/>
                                    {info.userEmail}<br/>
                                    Descrição <br/>
                                    {info.userDescricao} <br/>
                                   {}
                                    
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default PainelEmocao;