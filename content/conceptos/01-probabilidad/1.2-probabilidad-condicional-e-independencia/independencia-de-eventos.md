---
id: independencia-de-eventos
titulo: Independencia de eventos
titulo_en: Independence of events
alias:
  - eventos independientes
  - independencia estadística
modulo: 1
submodulo: '1.2'
orden: 9
nivel: basico
prerrequisitos:
  - probabilidad-condicional
relaciones:
  - tipo: contrasta
    id: eventos
etiquetas:
  - independencia
  - producto de probabilidades
  - información irrelevante
  - eventos excluyentes
resumen: >
  Dos eventos son independientes si saber que uno ocurrió no cambia la probabilidad del otro.
  Equivale a que la probabilidad de que ocurran ambos sea el producto de sus probabilidades.
formula: 'P(A \cap B) = P(A)\,P(B)'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: condicional
    experimento: dos-dados
    eventoA: suma-7
    eventoB: primero-6
    eventos: [suma-7, primero-6, suma-8, primero-par, segundo-par, suma-par, dobles, al-menos-un-seis]
referencias:
  - clave: blitzstein-hwang
    capitulo: '2.5'
  - clave: ross-probabilidad
    capitulo: '3.4'
publicado: true
---

## Intuición

Dos eventos son independientes cuando enterarse de uno no dice nada sobre el otro. El resultado de un dado no informa sobre el de otro dado lanzado por separado; la lluvia en Monterrey hoy no informa sobre si una persona en Mérida gana la lotería. En esos casos, la probabilidad condicional es igual a la probabilidad original: $P(A \mid B) = P(A)$.

A veces la independencia no es evidente. Al lanzar dos dados, saber que el primero salió 6 no cambia la probabilidad de que la suma sea 7: sigue siendo 1/6, porque sea cual sea el primer dado hay exactamente un valor del segundo que completa 7. En cambio, sí cambia la probabilidad de que la suma sea 8, que pasa de 5/36 a 1/6. La independencia es una propiedad numérica de la asignación de probabilidades, no solo de la física del experimento.

La consecuencia más usada es la regla del producto simplificada: si $A$ y $B$ son independientes, $P(A \cap B) = P(A)\,P(B)$. Esa igualdad se toma como definición porque es simétrica y funciona aun cuando alguna probabilidad es 0.

## Definición

:::definicion[Eventos independientes]
Los eventos $A$ y $B$ son **independientes** si
$$
P(A \cap B) = P(A)\,P(B).
$$
:::

Si $P(B) > 0$, la definición equivale a $P(A \mid B) = P(A)$, y si $P(A) > 0$, a $P(B \mid A) = P(B)$. Si $A$ y $B$ no son independientes se dice que son **dependientes**.

:::figura[En el cuadrado, la independencia es una línea divisoria recta: la proporción de tráfico es 0.4 tanto en días de lluvia como sin lluvia, y el área de cada rectángulo es el producto de ancho por altura.]{componente="ProbabilitySquare"}
```yaml
modo: independencia
particion:
  - etiqueta: Llueve
    prob: 0.3
  - etiqueta: No llueve
    prob: 0.7
evento: Tráfico
complemento: sin tráfico
condicionales: [0.4, 0.4]
```
:::

:::nota[Qué significa cada símbolo]
- $A$, $B$: eventos.
- $A \cap B$: ocurren ambos.
- $P(A)\,P(B)$: producto de sus probabilidades.
- $P(A \mid B)$: probabilidad de $A$ sabiendo que ocurrió $B$.
- $A^{c}$, $B^{c}$: complementos.
- $p_1, p_2$: probabilidades de falla de cada componente en el ejemplo.
:::

## Cómo usar la visualización

La rejilla muestra los 36 resultados de dos dados con A = "la suma es 7" y B = "el primer dado es 6". La animación calcula $P(A)$, descarta los resultados fuera de B y calcula $P(A \mid B)$. Si los dos valores coinciden, el panel indica que la probabilidad "no cambia": los eventos son independientes.

Con la suma 7 y el primer dado 6, ambos valores son 1/6. Al cambiar A a "la suma es 8", $P(A)$ es 5/36 y $P(A \mid B)$ es 1/6: hay dependencia. "Primer dado par" y "suma par" también son independientes, aunque la suma depende del primer dado; en cambio, "dobles" y "suma par" no lo son.

## Ejemplo

Un servidor tiene dos fuentes de poder que fallan de manera independiente en un día con probabilidades $p_1 = 0.02$ y $p_2 = 0.03$. El servidor solo se apaga si fallan las dos.

1. Fallan las dos: $P(F_1 \cap F_2) = 0.02 \cdot 0.03 = 0.0006$.
2. Falla al menos una: $P(F_1 \cup F_2) = 0.02 + 0.03 - 0.0006 = 0.0494$.
3. No falla ninguna: $P(F_1^{c} \cap F_2^{c}) = 0.98 \cdot 0.97 = 0.9506$, que coincide con $1 - 0.0494$.

La redundancia reduce la probabilidad de apagado de 2 % a 0.06 %, siempre que las fallas sean realmente independientes. Si ambas fuentes dependen del mismo circuito, la independencia es falsa y el cálculo es demasiado optimista.

:::figura[Las fuentes del ejemplo como árbol: por la independencia, las ramas de la fuente 2 valen 0.03 y 0.97 en ambos casos. El camino de las dos fallas da 0.0006.]{componente="ProbabilityTree"}
```yaml
niveles: [Fuente 1, Fuente 2]
ramas:
  - etiqueta: Falla
    prob: 0.02
    ramas:
      - etiqueta: Falla
        prob: 0.03
      - etiqueta: Funciona
        prob: 0.97
  - etiqueta: Funciona
    prob: 0.98
    ramas:
      - etiqueta: Falla
        prob: 0.03
      - etiqueta: Funciona
        prob: 0.97
consultas:
  - nombre: Fallan las dos
    hojas: [Falla/Falla]
  - nombre: Falla al menos una
    hojas: [Falla/Falla, Falla/Funciona, Funciona/Falla]
```
:::

## Propiedades

- **Complementos:** si $A$ y $B$ son independientes, también lo son $A$ y $B^{c}$, $A^{c}$ y $B$, y $A^{c}$ y $B^{c}$.
- **Eventos triviales:** todo evento es independiente de $\Omega$ y de $\varnothing$, y un evento con probabilidad 0 o 1 es independiente de cualquier otro.
- **Excluyentes no es independientes:** si $A \cap B = \varnothing$ con $P(A) > 0$ y $P(B) > 0$, entonces $P(A \cap B) = 0 \neq P(A)\,P(B)$: los eventos excluyentes son dependientes, porque saber que ocurrió uno garantiza que el otro no.
- **Varios eventos:** para más de dos eventos hay que distinguir entre independencia por pares e independencia mutua.

:::figura[Independencia que no es obvia: "el primer dado es par" y "la suma es par" son independientes. Dentro de los pares del primer dado, la mitad de las casillas tiene suma par, igual que en todo el espacio.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: dos-dados
eventoA: suma-par
eventoB: primero-par
eventos: [suma-par, primero-par]
```
:::

:::figura[Independencia en una baraja: "rey" y "corazones" son independientes. Entre los 13 corazones hay 1 rey, la misma proporción 1/13 que en las 52 cartas.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: carta
eventoA: rey
eventoB: corazon
eventos: [rey, corazon, figura, roja]
```
:::

## Errores comunes

- **Confundir independientes con excluyentes.** Son casi opuestos: dos eventos excluyentes con probabilidad positiva siempre son dependientes.
- **Suponer independencia por comodidad.** Multiplicar probabilidades de fallas que comparten una causa común (la misma tormenta, el mismo proveedor) subestima mucho el riesgo conjunto.
- **Creer que la independencia es evidente por el experimento.** En el mismo par de dados, "suma 7" es independiente del primer dado, pero "suma 8" no lo es.

:::figura[Excluyentes no es independientes: "suma 7" y "dobles" no comparten casillas. Saber que salieron dobles hace imposible la suma 7, de modo que P(suma 7 dado dobles) = 0, distinta de 1/6.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: dos-dados
eventoA: suma-7
eventoB: dobles
eventos: [suma-7, dobles]
```
:::

:::figura[Dependencia en el mismo experimento: saber que el primer dado es 6 sube la probabilidad de suma 8 de 5/36 a 6/36.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: dos-dados
eventoA: suma-8
eventoB: primero-6
eventos: [suma-8, primero-6]
```
:::

## Conexiones

La independencia es el caso en que la [[probabilidad-condicional]] no difiere de la original y la [[regla-del-producto]] se simplifica. Para tres o más eventos se distingue entre [[independencia-por-pares-vs-independencia-mutua]], y la [[independencia-condicional]] describe eventos independientes dentro de cada caso de una partición. La [[falacia-del-jugador]] es el error de no aceptar la independencia entre lanzamientos. Con variables aleatorias, la independencia se define exigiendo la misma factorización para todos los eventos que dependen de cada variable.

## Formulario

:::formula[Definición]
$$
P(A \cap B) = P(A)\,P(B)
$$

- $A$, $B$: eventos independientes.
:::

:::formula[Forma condicional]
$$
P(A \mid B) = P(A), \qquad P(B) > 0
$$

- Saber que ocurrió $B$ no cambia la probabilidad de $A$.
:::

:::formula[Complementos]
$$
P(A^{c} \cap B^{c}) = P(A^{c})\,P(B^{c}) = (1 - P(A))(1 - P(B))
$$

- Si $A$ y $B$ son independientes, sus complementos también.
:::

:::formula[Al menos uno de dos eventos independientes]
$$
P(A \cup B) = 1 - (1 - P(A))(1 - P(B))
$$

- Se calcula por el complemento: ninguno de los dos ocurre.
:::
