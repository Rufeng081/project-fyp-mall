const fs = require('fs');
const path = require('path');

const jmeterDir = path.join(__dirname, '..', 'docs', 'testing', 'jmeter');
const files = fs.readdirSync(jmeterDir)
  .filter((name) => name.endsWith('.jmx'))
  .sort();

function assertionXml(testName, expectedText) {
  return `<ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="${testName}" enabled="true"><collectionProp name="Asserion.test_strings"><stringProp name="0">${expectedText}</stringProp></collectionProp><stringProp name="Assertion.custom_message"></stringProp><stringProp name="Assertion.test_field">Assertion.response_data</stringProp><boolProp name="Assertion.assume_success">false</boolProp><intProp name="Assertion.test_type">2</intProp></ResponseAssertion><hashTree/>`;
}

const jsonAssertion = assertionXml('Assert JSON code 200', '&quot;code&quot;:&quot;200&quot;');
const homepageAssertion = assertionXml('Assert Homepage Vue Mount', 'id=&quot;app&quot;');

function findMatchingHashTree(xml, openIndex) {
  const tokenPattern = /<hashTree\/>|<hashTree>|<\/hashTree>/g;
  tokenPattern.lastIndex = openIndex;
  let depth = 0;
  let match;

  while ((match = tokenPattern.exec(xml)) !== null) {
    const token = match[0];
    if (token === '<hashTree/>') {
      if (match.index === openIndex) {
        return {
          start: openIndex,
          end: tokenPattern.lastIndex,
          selfClosing: true,
        };
      }
      continue;
    }

    if (token === '<hashTree>') {
      depth += 1;
      continue;
    }

    depth -= 1;
    if (depth === 0) {
      return {
        start: openIndex,
        end: tokenPattern.lastIndex,
        selfClosing: false,
      };
    }
  }

  throw new Error(`Unable to match hashTree at index ${openIndex}`);
}

function addAssertions(xml, fileName) {
  let cursor = 0;
  let output = '';
  let inserted = 0;
  const samplerPattern = /<HTTPSamplerProxy\b[^>]*testname="([^"]+)"[^>]*>/g;

  while (true) {
    samplerPattern.lastIndex = cursor;
    const samplerMatch = samplerPattern.exec(xml);
    if (!samplerMatch) {
      output += xml.slice(cursor);
      break;
    }

    const samplerStart = samplerMatch.index;
    const samplerEndTag = '</HTTPSamplerProxy>';
    const samplerEnd = xml.indexOf(samplerEndTag, samplerPattern.lastIndex);
    if (samplerEnd === -1) {
      throw new Error(`Missing sampler close tag in ${fileName}`);
    }

    const afterSampler = samplerEnd + samplerEndTag.length;
    const whitespaceMatch = /^[\s\r\n]*/.exec(xml.slice(afterSampler));
    const hashStart = afterSampler + whitespaceMatch[0].length;
    if (!xml.startsWith('<hashTree', hashStart)) {
      throw new Error(`Missing sampler child hashTree in ${fileName}`);
    }

    const child = findMatchingHashTree(xml, hashStart);
    const samplerText = xml.slice(samplerStart, child.end);

    output += xml.slice(cursor, child.start);

    if (samplerText.includes('testclass="ResponseAssertion"')) {
      output += xml.slice(child.start, child.end);
    } else {
      const assertion = samplerMatch[1] === 'GET Homepage HTML' ? homepageAssertion : jsonAssertion;
      if (child.selfClosing) {
        output += `<hashTree>${assertion}</hashTree>`;
      } else {
        const childText = xml.slice(child.start, child.end);
        output += childText.replace('<hashTree>', `<hashTree>${assertion}`);
      }
      inserted += 1;
    }

    cursor = child.end;
  }

  return { xml: output, inserted };
}

let total = 0;
for (const file of files) {
  const fullPath = path.join(jmeterDir, file);
  const original = fs.readFileSync(fullPath, 'utf8');
  const result = addAssertions(original, file);
  if (result.xml !== original) {
    fs.writeFileSync(fullPath, result.xml);
  }
  total += result.inserted;
  console.log(`${file}: inserted ${result.inserted} assertion(s)`);
}

console.log(`Total assertions inserted: ${total}`);
