//módulos externos
import inquirer from "inquirer";
import chalk from "chalk";

//módulo interno
import fs from "fs";

operation();

function operation(){
    inquirer.prompt([
        {
            type:'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
        },
    ])
    .then((answer) => {
        const action = answer['action'];

        if(action ===  'Criar Conta') {
            createAccount();
        } else if(action === 'Depositar') {
            deposit();
        } else if(action === 'Consultar Saldo') {
            getAccountBalance();
        } else if(action === 'Sacar') {

        } else if(action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'));
            process.exit();
        }
    })
    .catch((err) => console.log(err));
}

//create an account
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco. Seja bem-vindo!'));
    console.log(chalk.green('Defina as opções da sua conta a seguir.'));

    buildAccount();
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta: '
        }
    ])
    .then(answer => {
        const accountName = answer['accountName'];

        console.log(accountName);

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts');
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(
                chalk.bgRed.black('Esta conta já existe, escolha outro nome!')
            )
            buildAccount();
            return;
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`, 
            '{"balance": 0}', 
            function(err){
                console.log(err);
        })

        console.log(chalk.green('Parabéns, a sua conta foi criada!'));
        operation();
    })
    .catch(err => console.log(err));
}

// add an amount to user account
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName'];

        // verify if account exists
        if(!checkAccount(accountName)){
            return deposit();
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual valor deseja depositar?',
            }
        ])
        .then((answer) =>{
            const amount = answer['amount'];

            // add an amount
            addAmount(accountName, amount);
            operation();
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

function checkAccount(accountName) {
    
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, tente novamente!'));
        return false;
    }
    
    return true;
}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName);

    if(!amount){
        console.log(
            chalk.bgRed.black('Ocorreu um erro, tente novamente!')
        );
        return deposit();
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err);
        }
    )

    console.log(
        chalk.green(`Foi depositado o valor de R$${amount} na sua conta.`)
    )
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    });

    return JSON.parse(accountJSON);
}

// show account balance
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName'];

        //verify is account exists 
        if(!checkAccount(accountName)){
            return getAccountBalance();
        }

        const accountData = getAccount(accountName);

        console.log(chalk.bgBlue.black(
            `Olá, o saldo da sua conta é de R$${accountData.balance}`
        ))
        operation();
    })
    .catch(err => console.log(err));
}