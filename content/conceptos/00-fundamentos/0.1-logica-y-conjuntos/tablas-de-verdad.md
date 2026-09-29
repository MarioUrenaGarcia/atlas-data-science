---
id: tablas-de-verdad
titulo: Tablas de verdad
titulo_en: Truth tables
alias:
  - tabla de valores de verdad
etiquetas:
  - lógica
  - tautología
  - equivalencia lógica
  - razonamiento
modulo: 0
submodulo: '0.1'
orden: 2
nivel: basico
prerrequisitos:
  - proposiciones-y-conectivos-logicos
relaciones:
  - tipo: relacionado
    id: leyes-de-de-morgan
resumen: >
  Una tabla de verdad lista todas las combinaciones de valores de las variables de una fórmula y el
  valor resultante. Permite decidir si la fórmula es tautología, contradicción o contingencia.
formula: '\text{filas} = 2^{k} \text{ para } k \text{ variables}'
visualizacion:
  componente: LogicViz
  parametros:
    modo: tabla
    formula: modus-tollens
    formulas:
      - implicacion
      - conjuncion
      - reciproca
      - contrapositiva
      - modus-tollens
      - silogismo
      - distributiva
      - contradiccion
      - tercero-excluido
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un técnico de mantenimiento quiere verificar un panel con dos interruptores y una luz de alarma que, según el manual, se enciende "si el primer interruptor está arriba y el segundo no". En lugar de razonar caso por caso de memoria, prueba todas las posiciones posibles: arriba y arriba, arriba y abajo, abajo y arriba, abajo y abajo. Cuatro pruebas bastan para conocer por completo el comportamiento del panel.

Una tabla de verdad hace exactamente eso con una fórmula lógica. Cada variable puede valer verdadero o falso, así que con dos variables hay cuatro combinaciones, con tres hay ocho y, en general, el número se duplica con cada variable nueva. Para cada combinación se calcula el valor de la fórmula por partes, de adentro hacia afuera, como se evalúa una expresión aritmética con paréntesis.

La tabla responde preguntas que la intuición resuelve mal: si dos formas de redactar una regla dicen lo mismo, si un argumento es válido o si una afirmación es verdadera sin importar los hechos.

## Definición

Sea $\varphi$ una fórmula proposicional con variables $p_1, \dots, p_k$. Una **asignación** es una función $v : \{p_1, \dots, p_k\} \to \{\text{V}, \text{F}\}$. La **tabla de verdad** de $\varphi$ enumera las $2^k$ asignaciones posibles y, para cada una, el valor de $\varphi$ calculado recursivamente con las tablas de los conectivos.

:::definicion[Clasificación de fórmulas]
- $\varphi$ es una **tautología** si es verdadera en todas las filas.
- $\varphi$ es una **contradicción** si es falsa en todas las filas.
- $\varphi$ es una **contingencia** si es verdadera en algunas filas y falsa en otras.
:::

Dos fórmulas $\varphi$ y $\psi$ son **equivalentes** si y solo si $\varphi \leftrightarrow \psi$ es una tautología. Un argumento con premisas $\varphi_1, \dots, \varphi_m$ y conclusión $\psi$ es **válido** si y solo si $(\varphi_1 \land \dots \land \varphi_m) \rightarrow \psi$ es una tautología.

## Cómo usar la visualización

La visualización llena la tabla celda por celda. Las primeras columnas contienen los valores de las variables; las siguientes, cada subfórmula en el orden en que se evalúa, y la última columna, remarcada, la fórmula completa. Al terminar se indica si es tautología, contradicción o contingencia.

El selector de fórmula permite comparar casos. Con el modus tollens la última columna queda llena de V: el razonamiento es válido. Con la equivalencia entre un condicional y su recíproco aparecen dos F, que muestran por qué afirmar el recíproco es un error. Con la distributividad, que tiene tres variables, la tabla crece a ocho filas.

## Ejemplo

Se quiere comprobar el razonamiento: "si un medicamento está caducado, la farmacia lo retira; la farmacia no lo retiró; por lo tanto, no está caducado". Con $p$: "está caducado" y $q$: "la farmacia lo retira", la fórmula es $((p \rightarrow q) \land \lnot q) \rightarrow \lnot p$.

| $p$ | $q$ | $p \rightarrow q$ | $\lnot q$ | $(p \rightarrow q) \land \lnot q$ | $\lnot p$ | fórmula |
|---|---|---|---|---|---|---|
| V | V | V | F | F | F | V |
| V | F | F | V | F | F | V |
| F | V | V | F | F | V | V |
| F | F | V | V | V | V | V |

La última columna es siempre V: el razonamiento es válido. La única fila donde las premisas son ambas verdaderas es la cuarta, y ahí la conclusión también lo es.

## Propiedades

- Una fórmula con $k$ variables tiene una tabla de $2^k$ filas; el tamaño crece exponencialmente, por lo que el método es práctico solo para pocas variables.
- $\varphi$ es tautología si y solo si $\lnot \varphi$ es contradicción.
- Toda tabla de verdad corresponde a alguna fórmula: basta tomar la disyunción de las conjunciones que describen cada fila verdadera (forma normal disyuntiva).
- Hay $2^{2^k}$ tablas distintas con $k$ variables, es decir, $2^{2^k}$ funciones booleanas diferentes.

:::demostracion
Una tabla con $k$ variables tiene $2^k$ filas y en cada una la fórmula puede valer V o F de forma independiente. Por el principio del producto hay $2 \cdot 2 \cdots 2 = 2^{2^k}$ columnas finales posibles.
:::

:::figura[Equivalencias clásicas comprobadas fila por fila. Cada fórmula es un bicondicional entre dos expresiones; que la última columna sea siempre V significa que ambas expresiones coinciden en todas las filas.]{componente="LogicViz"}
```yaml
modo: tabla
formula: de-morgan-y
formulas: [de-morgan-y, de-morgan-o, distributiva, contrapositiva]
```
:::

## Errores comunes

- **Omitir filas.** Con tres variables hacen falta ocho filas; un orden sistemático (como contar en binario) evita olvidar combinaciones.
- **Evaluar en el orden equivocado.** La negación afecta solo a lo que tiene inmediatamente a su derecha: $\lnot p \land q$ no es $\lnot(p \land q)$.
- **Confundir argumento válido con conclusión verdadera.** La validez dice que la conclusión se sigue de las premisas; si una premisa es falsa, la conclusión puede ser falsa aunque el argumento sea válido.
- **Concluir equivalencia comparando algunas filas.** Dos fórmulas son equivalentes solo si coinciden en todas las filas.

:::figura[Tautología, contradicción y contingencia. El tercero excluido es verdadero en todas las filas, la contradicción es falsa en todas, y la conjunción con negación depende de los valores de $p$ y $q$.]{componente="LogicViz"}
```yaml
modo: tabla
formula: tercero-excluido
formulas: [tercero-excluido, contradiccion, conjuncion, silogismo]
```
:::

## Conexiones

Las tablas se construyen a partir de los [[proposiciones-y-conectivos-logicos|conectivos lógicos]]. Con ellas se verifican las [[leyes-de-de-morgan]] en su versión lógica. El conteo de filas es una aplicación del principio del producto, y el número de subconjuntos de variables verdaderas se relaciona con el [[conjunto-potencia]].
