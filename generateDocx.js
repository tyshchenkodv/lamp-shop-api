const dayjs = require('dayjs');
const numberToString = require('number-to-cyrillic');
require('dayjs/locale/uk');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const BadRequestException = require('./exceptions/BadRequestException');
const InternalErrorException = require('./exceptions/InternalErrorException');

const fs = require('fs');
const path = require('path');

// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
function replaceErrors(key, value) {
    if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function(error, key) {
            error[key] = value[key];
            return error;
        }, {});
    }
    return value;
}

function errorHandler(error) {
    console.log(JSON.stringify({error: error}, replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function (error) {
            return error.properties.explanation;
        }).join("\n");
        console.log('errorMessages', errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
    }
    throw error;
}

async function createDocx(myObj) {
    const target = myObj.product;

    const getCountIds = target => {
        const result = new Object;

        target.forEach(item => result[item.id] ? result[item.id]++ : result[item.id] = 1)

        return Object.keys(result).map(item => {
            return {
                id: parseInt(item),
                sum: result[item]
            }
        })
    }

    const countIds = getCountIds(target);
    countIds.forEach(item => {
        target.forEach(product => {
            if(item.id === product.id){
                item.name = product.name;
                item.code = product.code;
                item.price = product.price;
            }
        })
    })

    let i = 1;
    countIds.forEach(item => {
        item.totalPrice = item.sum * item.price;
        item.i = i;
        i++;
    });

    const dataForDocx = {};
    dataForDocx.date = dayjs().locale('uk').format('D MMMM YYYY');
    dataForDocx.customerfullName = myObj.customer.lastName + ' ' + myObj.customer.firstName;
    dataForDocx.customerPhone = myObj.customer.phone;
    dataForDocx.totalPrice = myObj.totalPrice;
    const totalPriceWords = numberToString.convert(myObj.totalPrice.toString());
    dataForDocx.totalPriceWords = totalPriceWords.convertedInteger.charAt(0).toUpperCase() +
        totalPriceWords.convertedInteger.slice(1) + ' ' +
        totalPriceWords.integerCurrency + ' ' +
        totalPriceWords.convertedFractional + ' ' +
        totalPriceWords.fractionalCurrency;
    dataForDocx.productsCount = countIds.length;
    dataForDocx.products = countIds;

//Load the docx file as a binary
    const content = fs
        .readFileSync(path.resolve('./docxTemplates/invoiceTemplate.docx'), 'binary');

    const zip = new PizZip(content);
    let doc;
    try {
        doc = new Docxtemplater(zip);
    } catch(error) {
        // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
        errorHandler(error);
    }

//set the templateVariables
    doc.setData(dataForDocx);

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
    }
    catch (error) {
        // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
        errorHandler(error);
    }

    var buf = doc.getZip()
        .generate({type: 'nodebuffer'});

// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve('./docxTemplates/output.docx'), buf);
}

module.exports = {
    generateInvoice: async (req, res, next) => {
        if(!req.body) {
            return next(new BadRequestException());
        }

        await createDocx(req.body);

        const options = {
            root: path.join(__dirname, 'docxTemplates'),
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        }
        const fileName = 'output.docx';

        return res.sendFile(fileName, options, function (err) {
            if (err) {
                return next(new InternalErrorException());
            }
        });
    },
};
