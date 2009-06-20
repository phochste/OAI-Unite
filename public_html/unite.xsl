<?xml version="1.0"?>
<xsl:stylesheet
    xmlns:oai="http://www.openarchives.org/OAI/2.0/"
    xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"    
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">

    <xsl:template match="/">
        <html>
         <head>
           <title>OAI-Unite</title>
           <style type="text/css">
           <![CDATA[
		body {
		 font-family: verdana, arial, helvetica;
		}
           ]]>
           </style>
           <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
         </head>
         <body>
	  <h1>OAI-Unite</h1>
          <div id="content">
            <xsl:apply-templates select="//oai:error"/>
            <xsl:apply-templates select="//oai:Identify"/>
            <xsl:apply-templates select="//oai:ListMetadataFormats"/>
            <xsl:apply-templates select="//oai:ListIdentifiers"/>
            <xsl:apply-templates select="//oai:ListRecords"/>
            <xsl:apply-templates select="//oai:GetRecord"/>
          </div>

         </body>
        </html>
    </xsl:template>

    <xsl:template match="oai:error">
           <p>
           The OAI server responded with the following message:
           </p>
           <p>
                <i><xsl:value-of select="//oai:error/@code"/> - <xsl:value-of select="//oai:error"/></i>
           </p>
           <p>
                Maybe you want to try one of the following requests:
                <ul>
                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=Identify</xsl:attribute>
                Identify
                </xsl:element>
                </li>
                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListMetadataFormats</xsl:attribute>
                ListMetadataFormats
                </xsl:element>
                </li>
                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListSets</xsl:attribute>
                ListSets
                </xsl:element>
                </li>

                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListIdentifiers&amp;metadataPrefix=oai_dc</xsl:attribute>
                ListIdentifiers
                </xsl:element>
                </li>
                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListRecords&amp;metadataPrefix=oai_dc</xsl:attribute>
                ListRecords
                </xsl:element>
                </li>
                <li>
                 <xsl:element name="form">
                  <xsl:attribute name="action"><xsl:value-of select="/oai:OAI-PMH/oai:request"/></xsl:attribute>
                  <input type="hidden" name="verb" value="GetRecord"/>
                  <input type="hidden" name="metadataPrefix" value="oai_dc"/>
                  <input type="text" name="identifier" value="" size="40"/>
                  <input type="submit" value="GetRecord"/>
                 </xsl:element>
                </li>
                </ul>
            </p>
    </xsl:template>

    <xsl:template match="oai:Identify">
           <p>
           Welcome to the repository here are some details for this repository:
           </p>

           <p>
           <table>
                <xsl:for-each select="//oai:Identify/*">
                <tr>
                 <td><xsl:value-of select="name(.)"/>:</td>
                 <td><xsl:value-of select="."/></td>
                </tr>
                </xsl:for-each>
           </table>
           </p>

           <p>
            Feel free to use any of the following services:
            <ul>
                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=Identify</xsl:attribute>
                Identify
                </xsl:element>
                </li>
                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListMetadataFormats</xsl:attribute>
                ListMetadataFormats
                </xsl:element>
                </li>
                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListSets</xsl:attribute>
                ListSets
                </xsl:element>
                </li>

                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListIdentifiers&amp;metadataPrefix=oai_dc</xsl:attribute>
                ListIdentifiers
                </xsl:element>
                </li>
                <li>
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListRecords&amp;metadataPrefix=oai_dc</xsl:attribute>
                ListRecords
                </xsl:element>
                </li>
                <li>
                 <xsl:element name="form">
                  <xsl:attribute name="action"><xsl:value-of select="/oai:OAI-PMH/oai:request"/></xsl:attribute>
                  <input type="hidden" name="verb" value="GetRecord"/>
                  <input type="hidden" name="metadataPrefix" value="oai_dc"/>
                  <input type="text" name="identifier" size="40" value="info:ugent-repo/aleph/rug01-"/>
                  <input type="submit" value="GetRecord"/>
                 </xsl:element>
                </li>
                </ul>
           </p>
    </xsl:template>

    <xsl:template match="oai:ListMetadataFormats">
           <p>
             We support the following formats:
             <ul>
              <xsl:for-each select="//oai:metadataFormat">
                <li>
                  <b><xsl:value-of select="./oai:metadataPrefix"/></b> -
                  [<xsl:value-of select="./oai:metadataNamespace"/>] - XSD schema
                  available
                  <xsl:element name="a">
                   <xsl:attribute name="href"><xsl:value-of select="./oai:schema"/></xsl:attribute>
                   here
                  </xsl:element>
                  .<br/>
                  <xsl:element name="a">
                    <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListIdentifiers&amp;metadataPrefix=<xsl:value-of select="./oai:metadataPrefix"/></xsl:attribute>
                    ListIdentifiers
                  </xsl:element>

                  |

                  <xsl:element name="a">
                    <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=ListRecords&amp;metadataPrefix=<xsl:value-of select="./oai:metadataPrefix"/></xsl:attribute>
                    ListRecords
                  </xsl:element>

                </li>
              </xsl:for-each>
             </ul>
           </p>
           <xsl:if test="//oai:resumptionToken">
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=<xsl:value-of select="/oai:OAI-PMH/oai:request/@verb"/>&amp;resumptionToken=<xsl:value-of select="//oai:resumptionToken"/></xsl:attribute>
                <h1>Next</h1>
                </xsl:element>
           </xsl:if>
    </xsl:template>

    <xsl:template match="oai:ListIdentifiers">

           <xsl:apply-templates select="//oai:header"/>
           <xsl:if test="//oai:resumptionToken">
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=<xsl:value-of select="/oai:OAI-PMH/oai:request/@verb"/>&amp;resumptionToken=<xsl:value-of select="//oai:resumptionToken"/></xsl:attribute>
                <h1>Next</h1>
                </xsl:element>
           </xsl:if>
    </xsl:template>

    <xsl:template match="oai:header">
        <p>
          <table border="1">
           <tr><td width="150">
         <xsl:element name="a">
          <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=GetRecord&amp;metadataPrefix=oai_dc&amp;identifier=<xsl:value-of select="oai:identifier"/></xsl:attribute>
         <font size="+1" color="#336699"><xsl:value-of select="oai:identifier"/></font><br/>
         </xsl:element>
           Date: <xsl:value-of select="oai:datestamp"/>
          </td>
          </tr>
         </table>
        </p>
    </xsl:template>

    <xsl:template match="oai:ListRecords">

           <xsl:apply-templates select="//oai:record"/>

           <xsl:if test="//oai:resumptionToken">
                <xsl:element name="a">
                <xsl:attribute name="href"><xsl:value-of select="/oai:OAI-PMH/oai:request"/>?verb=<xsl:value-of select="/oai:OAI-PMH/oai:request/@verb"/>&amp;resumptionToken=<xsl:value-of select="//oai:resumptionToken"/></xsl:attribute>
                <h1>Next</h1>
                </xsl:element>
           </xsl:if>
    </xsl:template>


    <xsl:template match="oai:GetRecord">
        <xsl:apply-templates select="//oai:record"/>
    </xsl:template>

    <xsl:template match="oai:record">
        <p>
         <table border="1">
          <tr>
          <td valign="top">
           <font size="+1" color="#336699"><xsl:value-of select="oai:header/oai:identifier"/></font><br/>
           Date: <xsl:value-of select="oai:header/oai:datestamp"/><br/>
          </td></tr>
         </table>
           <br/>
           <b>Record:</b><br/>
           <br/>
           <xsl:apply-templates select="oai:metadata/oai_dc:dc"/>
        </p>
    </xsl:template>

    <xsl:template match="oai_dc:dc">
      <table>
       <xsl:for-each select="./*">
        <tr>
         <td><b><xsl:value-of select="name()"/></b></td>
         <td><xsl:value-of select="text()"/></td>
        </tr>
       </xsl:for-each>
      </table>
    </xsl:template>

</xsl:stylesheet>
