# instalar sls
npm i -g serverless

#inicializar 
sls

# sempre fazer deploy
sls deploy

# invovar
#na aws
sls invoke -f $nomeFuncao
#local (-l == --log)
sls invoke local -f $nomeFuncao


#logs 
sls logs -f $nomeFuncao -t

#remover
sls remove