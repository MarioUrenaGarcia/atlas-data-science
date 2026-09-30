---
id: proposiciones-y-conectivos-logicos
titulo: Proposiciones y conectivos lógicos
titulo_en: Propositions and logical connectives
alias:
  - conectivas lógicas
  - operadores lógicos
  - lógica proposicional
modulo: 0
submodulo: '0.1'
orden: 1
nivel: basico
prerrequisitos: []
relaciones:
  - tipo: relacionado
    id: tablas-de-verdad
etiquetas:
  - lógica
  - proposiciones
  - conectivos
  - condicional
resumen: >
  Una proposición es un enunciado que es verdadero o falso. Los conectivos (negación, conjunción,
  disyunción, condicional y bicondicional) combinan proposiciones y su valor depende solo del de sus partes.
formula: 'p \rightarrow q \equiv \lnot p \lor q'
visualizacion:
  componente: LogicViz
  parametros:
    modo: conectivos
    enunciados:
      p: El partido se juega con lluvia
      q: La cancha termina mojada
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un árbitro revisa el reglamento antes de un partido. Algunas frases del reglamento pueden comprobarse como ciertas o falsas: "el partido se juega con lluvia", "la cancha termina mojada". Otras, como "ojalá gane el mejor equipo" o "¿a qué hora empieza?", no afirman nada que pueda ser verdadero o falso. Las primeras son proposiciones.

Con proposiciones sencillas se arman otras más complejas usando unas cuantas palabras: "no", "y", "o", "si... entonces" y "si y solo si". Estas palabras son los conectivos. Lo importante es que el valor de verdad de la frase compuesta queda determinado por el de sus piezas, sin importar de qué traten. "Llueve y la cancha está mojada" es verdadera exactamente cuando ambas partes lo son, ya se hable de fútbol o de química.

El conectivo que más confunde es el condicional. "Si se juega con lluvia, la cancha termina mojada" solo se incumple en un caso: cuando llovió y la cancha quedó seca. Si no llovió, la promesa no se pone a prueba y la frase se considera verdadera.

## Definición

Una **proposición** es un enunciado declarativo al que se le asigna exactamente uno de dos valores de verdad: verdadero (V) o falso (F). Se denotan con letras minúsculas $p, q, r$.

:::definicion[Conectivos lógicos]
Dadas proposiciones $p$ y $q$:

- **Negación** $\lnot p$: es verdadera si y solo si $p$ es falsa.
- **Conjunción** $p \land q$: es verdadera si y solo si ambas son verdaderas.
- **Disyunción** $p \lor q$: es verdadera si al menos una es verdadera (disyunción inclusiva).
- **Disyunción exclusiva** $p \oplus q$: es verdadera si exactamente una es verdadera.
- **Condicional** $p \rightarrow q$: es falsa solo cuando $p$ es verdadera y $q$ es falsa. A $p$ se le llama antecedente y a $q$ consecuente.
- **Bicondicional** $p \leftrightarrow q$: es verdadera cuando $p$ y $q$ tienen el mismo valor.
:::

Dos proposiciones compuestas son **lógicamente equivalentes**, $A \equiv B$, si tienen el mismo valor de verdad para toda asignación de valores a sus variables.

:::nota[Qué significa cada símbolo]
- $p, q, r$: proposiciones, enunciados que son verdaderos (V) o falsos (F).
- $\lnot$: "no", negación.
- $\land$: "y", conjunción.
- $\lor$: "o" inclusivo, disyunción.
- $\oplus$: "o" exclusivo, verdadero cuando exactamente una es verdadera.
- $\rightarrow$: "si ... entonces", condicional; lo que va antes es el antecedente y lo que va después el consecuente.
- $\leftrightarrow$: "si y solo si", bicondicional.
- $\equiv$: "es lógicamente equivalente a", mismo valor de verdad en todos los casos.
:::

## Cómo usar la visualización

La visualización muestra dos proposiciones concretas, $p$ y $q$, y una tabla con el valor de los seis conectivos para cada combinación de valores. La fila resaltada corresponde a los valores actuales. La reproducción recorre las cuatro combinaciones posibles; los botones del panel cambian el valor de $p$ o de $q$ directamente.

Al fijar $p$ como falsa, las columnas del condicional y de la disyunción cambian de forma distinta: el condicional se vuelve verdadero sin importar $q$. Al comparar las columnas de $p \lor q$ y $p \oplus q$ se observa que solo difieren en la fila donde ambas son verdaderas. La columna del bicondicional coincide con la de $\lnot(p \oplus q)$.

## Ejemplo

Sea $p$: "la temperatura supera 30 grados" y $q$: "se activa el ventilador". Un día la temperatura es de 32 grados y el ventilador sigue apagado, así que $p$ es V y $q$ es F.

1. $\lnot p$ es F, porque $p$ es V.
2. $p \land q$ es F, porque $q$ es F.
3. $p \lor q$ es V, porque $p$ es V.
4. $p \rightarrow q$ es F: el antecedente se cumple y el consecuente no. La regla "si supera 30 grados, se activa el ventilador" se incumplió.
5. $\lnot p \lor q$ es F, igual que el condicional, como predice la equivalencia $p \rightarrow q \equiv \lnot p \lor q$.
6. $p \leftrightarrow q$ es F, porque los valores difieren.

:::figura[Las proposiciones del ejemplo con $p$ verdadera y $q$ falsa. Los botones cambian los valores de verdad y todos los conectivos se recalculan a la vez.]{componente="LogicViz"}
```yaml
modo: conectivos
enunciados:
  p: La temperatura supera 30 grados
  q: Se activa el ventilador
inicial:
  p: true
  q: false
```
:::

## Propiedades

- **Doble negación:** $\lnot \lnot p \equiv p$.
- **Condicional como disyunción:** $p \rightarrow q \equiv \lnot p \lor q$.
- **Contrapositiva:** $p \rightarrow q \equiv \lnot q \rightarrow \lnot p$.
- **Bicondicional:** $p \leftrightarrow q \equiv (p \rightarrow q) \land (q \rightarrow p)$.
- **Conmutatividad y asociatividad** de $\land$ y $\lor$: el orden y el agrupamiento no cambian el valor.
- Con $\lnot$ y $\land$ (o con $\lnot$ y $\lor$) se puede expresar cualquier otro conectivo binario.

:::demostracion
Para la contrapositiva, usamos la equivalencia del condicional dos veces: $\lnot q \rightarrow \lnot p \equiv \lnot\lnot q \lor \lnot p \equiv q \lor \lnot p \equiv \lnot p \lor q \equiv p \rightarrow q$.
:::

:::figura[Los conectivos vistos como conjuntos de días. En un mes de 30 días, $p$ es el conjunto de días con más de 30 grados y $q$ el de días con el ventilador encendido. Cada consulta sombrea los días en que la proposición compuesta es verdadera; el condicional solo es falso en los 3 días calurosos sin ventilador.]{componente="VennSets"}
```yaml
modo: conteos
etiquetas: [p, q]
universo: Días del mes
conteos:
  pq: 12
  p: 3
  q: 5
  ninguno: 10
consultas:
  - nombre: "p ∧ q"
    regiones: [pq]
  - nombre: "p ∨ q"
    regiones: [p, q, pq]
  - nombre: "¬p"
    regiones: [q, ninguno]
  - nombre: "p implica q"
    regiones: [q, pq, ninguno]
  - nombre: "p si y solo si q"
    regiones: [pq, ninguno]
  - nombre: "p ⊕ q"
    regiones: [p, q]
```
:::

## Errores comunes

- **Confundir el condicional con su recíproco.** De $p \rightarrow q$ no se deduce $q \rightarrow p$: que la cancha esté mojada no implica que haya llovido (pudo regarse).
- **Pensar que un condicional con antecedente falso es falso.** Si $p$ es F, $p \rightarrow q$ es V; la regla no se pone a prueba.
- **Leer "o" siempre como exclusivo.** En matemáticas, "o" es inclusivo salvo que se diga lo contrario; $p \lor q$ es verdadera cuando ambas lo son.
- **Tratar preguntas u órdenes como proposiciones.** Solo los enunciados que pueden ser verdaderos o falsos lo son.
- **Creer que el condicional expresa causalidad.** $p \rightarrow q$ solo afirma que no ocurre "$p$ verdadera y $q$ falsa"; no dice que $p$ cause $q$.

:::figura[Tablas que desmienten dos errores frecuentes. El condicional y su recíproco no coinciden en dos filas, y la disyunción inclusiva y la exclusiva difieren justo cuando ambas proposiciones son verdaderas.]{componente="LogicViz"}
```yaml
modo: tabla
formula: reciproca
formulas: [reciproca, xor-vs-o, implicacion]
```
:::

## Conexiones

Las [[tablas-de-verdad]] organizan sistemáticamente el valor de cualquier combinación de conectivos. Los [[cuantificadores-universal-y-existencial]] extienden la lógica proposicional a enunciados sobre todos o algunos elementos de un conjunto. Las operaciones de conjuntos reflejan los conectivos: la unión corresponde a $\lor$, la intersección a $\land$ y el complemento a $\lnot$, como se ve en [[operaciones-de-conjuntos]] y en las [[leyes-de-de-morgan]].

## Formulario

:::formula[Condicional como disyunción]
$$
p \rightarrow q \equiv \lnot p \lor q
$$

- $p$: antecedente, la condición.
- $q$: consecuente, lo que se afirma si se cumple la condición.
- $\rightarrow$: condicional, falso solo cuando $p$ es V y $q$ es F.
- $\lnot p$: negación de $p$.
- $\lor$: disyunción inclusiva.
- $\equiv$: equivalencia lógica.
:::

:::formula[Contrapositiva]
$$
p \rightarrow q \equiv \lnot q \rightarrow \lnot p
$$

- $p, q$: proposiciones cualesquiera.
- $\lnot q \rightarrow \lnot p$: la contrapositiva, "si no ocurre $q$, no ocurrió $p$".
- $\equiv$: ambas tienen el mismo valor de verdad en todas las filas.
:::

:::formula[Bicondicional como doble condicional]
$$
p \leftrightarrow q \equiv (p \rightarrow q) \land (q \rightarrow p)
$$

- $\leftrightarrow$: bicondicional, verdadero cuando $p$ y $q$ tienen el mismo valor.
- $q \rightarrow p$: el recíproco de $p \rightarrow q$.
- $\land$: conjunción, verdadera si ambas partes lo son.
:::

:::formula[Doble negación]
$$
\lnot \lnot p \equiv p
$$

- $\lnot \lnot p$: negar dos veces la proposición $p$.
- $p$: la proposición original.
:::
